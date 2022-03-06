import { LoopEngineState, LoopProgram, LoopProgramState } from './types'

export class LoopEngine {
	private program_states:Map<LoopProgram, LoopProgramState> = new Map()
	private program_inits:Map<LoopProgram, Function> = new Map()
	private program_updates:Map<LoopProgram, Function> = new Map()
	private program_renders:Map<LoopProgram, Function> = new Map()
	private program_destroys:Map<LoopProgram, Function> = new Map()

	linkProgram(program:LoopProgram) {
		this.program_states.set(program, LoopProgramState.IDLE)

		if (program.init) {
			const init = async () => {
				let initialized = program.init!()
				if (!initialized || !(initialized as Promise<void>).then) initialized = Promise.resolve(initialized)

				await initialized

				this.program_states.set(program, LoopProgramState.INITIALIZED)

				// Add any update or render calls
				if (program.update) this.program_updates.set(program, program.update)
				if (program.render) this.program_renders.set(program, program.render)
			}

			this.program_inits.set(program, init)
			if ([LoopEngineState.RUNNING, LoopEngineState.PAUSED].includes(this.state)) { // Adding a program while the loop is running
				init()
			}
		}

		if (program.destroy) this.program_destroys.set(program, () => {
			if (this.program_states.get(program) == LoopProgramState.INITIALIZED) {
				this.program_updates.delete(program)
				this.program_renders.delete(program)

				program.destroy!()
				this.program_states.set(program, LoopProgramState.DESTROYED)
			}
		})
	}

	unlinkProgram(program:LoopProgram) {
		this.program_states.delete(program)
		this.program_inits.delete(program)
		this.program_updates.delete(program)
		this.program_renders.delete(program)
		this.program_destroys.delete(program)
	}

	private state:LoopEngineState = LoopEngineState.IDLE
	private last_loop_time:number = 0
	update_speed:number = 1
	update_time_step:number = 100 // in ms

	async init() {
		if ([LoopEngineState.IDLE, LoopEngineState.DESTROYED].includes(this.state)) {
			this.last_loop_time = performance.now()
			this.state = LoopEngineState.RUNNING

			try {
				await Promise.all(Array.from(this.program_inits.values()).map((init) => init()))
			} catch(e) {
				console.log(e)
				throw new Error(`Error initializing`)
			}

			this.requestLoop()
		}
	}

	private animation_frame:number
	requestLoop() {
		this.animation_frame = requestAnimationFrame(this.loop.bind(this))
	}
	cancelLoop() {
		if (this.animation_frame) cancelAnimationFrame(this.animation_frame)
	}

	private accumulated_frame_time = 0
	loop(time:number) {
		if ([LoopEngineState.IDLE, LoopEngineState.DESTROYED].includes(this.state)) return

		if (this.state == LoopEngineState.RUNNING) {
			this.accumulated_frame_time += time - this.last_loop_time

			while (this.accumulated_frame_time >= this.update_time_step) {
				this.update(this.update_time_step)
				this.accumulated_frame_time -= this.update_time_step
			}
		}

		let interpolation = this.accumulated_frame_time / this.update_time_step // get how far we are through the next update
		this.render(interpolation)

		this.last_loop_time = time
		this.requestLoop()
	}

	update(dt:number) {
		this.program_updates.forEach((update) => update(dt * this.update_speed))
	}

	render(interpolation:number) {
		this.program_renders.forEach(render => render(interpolation))
	}
}
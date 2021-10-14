export class TimeUtil {
	public advanceTime15Min(time) {
		const {hours, minutes} = this.decomposeTime(time)
		if(minutes < 45) {
			return (hours * 100) + (minutes + 15)
		} else {
			return ((hours + 1) * 100)
		}
	}

	public decomposeTime(time) {
		const minutes = time % 100
		const hours = (time - minutes) / 100
		return {hours, minutes}
	}

	public isTimeValid(time) {

		const {minutes, hours} = this.decomposeTime(time)

		if (hours < 0 || hours > 23) return false
		if (minutes % 15 !== 0) return false

		return true
	}
}
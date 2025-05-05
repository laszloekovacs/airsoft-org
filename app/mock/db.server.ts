const mockDatabase = {
	events: [
		{
			url: '2023-11-20-event',
			name: 'Event Name',
			date: '2023-11-20'
		},
		{
			url: '2023-11-20-another-event',
			name: 'Another Event',
			date: '2023-11-20'
		}
	],
	findEventByUrl: async function (url: string, success: boolean = true) {
		return success == true ? this.events : []
	},

	createEvent: async function (event: {
		url: string
		name: string
		date: string
	}) {
		this.events.push(event)
		return event
	}
}

export default mockDatabase

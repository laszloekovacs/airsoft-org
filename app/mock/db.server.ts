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
	}
}

export default mockDatabase

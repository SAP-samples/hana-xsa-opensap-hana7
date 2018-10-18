	this.after("READ", entities.POItems, (entity) => {
		if (entity.length > 0) {
			let now = new Date();
			let nextMonth = new Date();
			nextMonth.setDate(now.getDate() + 30);
			entity[0].DELIVERYDATE = nextMonth.toJSON();
		}
	});

const transition = [
	{
		id: "Txn000001",
		service: "CashIn With MPU",
		amount: 200000,
		senderName: "MPU_BILLER",
		senderId: "B000001",
		senderClient: "biller",
		receiverName: "Aung Aung",
		receiverId: "C000001",
		receiverClient: "customer",
		creditDebit: [
			{
				amount: 200000,
				description: "Origin Amount",
				credit: {
					target: "C000001",
				},
				debit: {
					target: "B000001",
				},
			},
			{
				amount: 500,
				fees: "Cashin Fee",
				credit: {
					target: "S000001",
				},
				debit: {
					target: "C000001",
				},
			},
		],
	},
	{
		id: "Txn000002",
		service: "Transfer to Wallet",
		amount: 50000,
		senderName: "Aung Aung",
		senderId: "C000001",
		senderClient: "customer",
		receiverName: "Bo Bo",
		receiverId: "C000002",
		receiverClient: "customer",
		creditDebit: [
			{
				amount: 50000,
				description: "Origin Amount",
				credit: {
					target: "C000002",
				},
				debit: {
					target: "C000001",
				},
			},
		],
	},
	{
		id: "Txn000003",
		service: "Pay Merchant",
		amount: 20000,
		senderName: "Bo Bo",
		senderId: "C000002",
		senderClient: "customer",
		receiverName: "Merchant 001",
		receiverId: "M000001",
		receiverClient: "merchant",
		creditDebit: [
			{
				amount: 20000,
				description: "Origin Amount",
				credit: {
					target: "M000001",
				},
				debit: {
					target: "C000002",
				},
			},
			{
				amount: 1000,
				description: "Cashback",
				credit: {
					target: "C000002",
				},
				debit: {
					target: "M000001",
				},
			},
		],
	},
];

function transformToCustomerBalances(transactions) {
	// initialize customers array
	const customers = [];
	transactions.forEach((txn) => {
		if (txn.senderClient === "customer" || txn.receiverClient === "customer") {
			const idToSet =
				txn.senderClient === "customer" ? txn.senderId : txn.receiverId;
			const nameToSet =
				txn.senderClient === "customer" ? txn.senderName : txn.receiverName;
			const customer = customers.find((c) => c.id === idToSet);
			if (!customer) {
				customers.push({
					id: idToSet,
					name: nameToSet,
					client: "customer",
					totalCredit: 0,
					totalDebit: 0,
				});
			}
		}
	});

	// Process all credit/debit entries
	transactions.forEach((txn) => {
		txn.creditDebit.forEach((entry) => {
			// Handle credits
			if (entry.credit) {
				const customer = customers.find((c) => c.id === entry.credit.target);
				if (customer) {
					customer.totalCredit += entry.amount;
				}
			}

			// Handle debits
			if (entry.debit) {
				const customer = customers.find((c) => c.id === entry.debit.target);
				if (customer) {
					customer.totalDebit += entry.amount;
				}
			}
		});
	});

	// Calculate balance and return array
	return customers.map((customer) => ({
		...customer,
		balance: customer.totalCredit - customer.totalDebit,
	}));
}

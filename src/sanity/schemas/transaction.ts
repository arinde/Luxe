const transaction = {
    name: "transaction",
    title: "Transaction",
    type: "document",
    fields: [
        {
            name: "txnRef",
            title: "Transaction Reference",
            type: "string",
            validation: (Rule: any) => Rule.required()
        },
        {
            name: "amount",
            title: "Amount",
            type: "number",
            validation: (Rule: any) => Rule.required().positive()
        },
        {
            name: "status",
            title: "Transaction Status",
            type: "string",
            validation: (Rule: any) => Rule.required(),
            options: {
                list: ["success", "failed", "cancelled"],
            },
        },
        {
            name: "responseCode",
            title: "Response Code",
            type: "string",
        },
        {
            name: "message",
            title: "Message",
            type: "string",
        },
        {
            name: "completedAt",
            title: "Transaction Time",
            type: "number",
        },
    ],
};

export default transaction;

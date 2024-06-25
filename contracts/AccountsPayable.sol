// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract AccountsPayable {
    struct Invoice {
        string description;
        uint256 amount;
        uint256 dueDate;
        address payable supplier;
        bool isPaid;
    }

    uint32 private nextInvoiceId = 0;
    mapping(uint32 => Invoice) public invoices;
    mapping(address => uint256) public balances;
    address private immutable owner;
    address public client;

    event InvoiceCreated(
        uint32 invoiceId,
        string description,
        uint256 amount,
        uint256 dueDate,
        address supplier
    );
    event InvoicePaid(uint32 invoiceId, address payer, uint256 amount);
    event FundsWithdrawn(address supplier, uint256 amount);

    constructor(address _client) {
        owner = msg.sender;
        client = _client;
    }

    function createInvoice(
        string memory description,
        uint256 amount,
        uint256 dueDate
    ) public {
        nextInvoiceId++;
        invoices[nextInvoiceId] = Invoice(
            description,
            amount,
            dueDate,
            payable(msg.sender),
            false
        );
        emit InvoiceCreated(
            nextInvoiceId,
            description,
            amount,
            dueDate,
            msg.sender
        );
    }

    function payInvoice(uint32 invoiceId) public payable {


        Invoice storage invoice = invoices[invoiceId];
        require(invoice.amount > 0, "Invoice does not exist");
        require(msg.value == invoice.amount, "Incorrect payment amount");
        require(!invoice.isPaid, "Invoice already paid");
        require(block.timestamp <= invoice.dueDate, "Invoice is overdue");

        invoice.isPaid = true;
        balances[invoice.supplier] += msg.value;
        emit InvoicePaid(invoiceId, msg.sender, msg.value);
    }

    function withdrawFunds() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }

    function checkInvoiceStatus(
        uint32 invoiceId
    ) public view returns (bool isPaid, uint256 dueDate) {
        Invoice storage invoice = invoices[invoiceId];
        return (invoice.isPaid, invoice.dueDate);
    }

    function getPendingInvoices(
        address supplier
    ) public view returns (uint32[] memory) {
        uint32 count = 0;

        // Count pending invoices first
        for (uint32 i = 1; i <= nextInvoiceId; i++) {
            if (invoices[i].supplier == supplier && !invoices[i].isPaid) {
                count++;
            }
        }

        // Create result array with correct size
        uint32[] memory results = new uint32[](count);

        // Add matching invoice IDs
        count = 0;
        for (uint32 i = 1; i <= nextInvoiceId; i++) {
            if (invoices[i].supplier == supplier && !invoices[i].isPaid) {
                results[count] = i;
                count++;
            }
        }

        return results;
    }

    function getAllPendingInvoices() public view returns (uint32[] memory) {
        uint32 count = 0;

        // Count all pending invoices first
        for (uint32 i = 1; i <= nextInvoiceId; i++) {
            
            count++;
            
        }

        // Create result array with correct size
        uint32[] memory results = new uint32[](count);

        // Add matching invoice IDs
        count = 0;
        for (uint32 i = 1; i <= nextInvoiceId; i++) {
            
                results[count] = i;
                count++;
            
        }

        return results;
    }

    modifier restricted() {
        require(owner == msg.sender, "You don't have permission.");
        _;
    }
}

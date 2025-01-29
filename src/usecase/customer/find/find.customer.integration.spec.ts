import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import { FindCustomerUseCase } from "./find.customer.usecase";

const MockRepository = () => {
    const customer = new Customer("123", "Johny");
    const address = new Address("street", 123, "zip", "city");
    customer.changeAddress(address);

    return {
        find: jest.fn().mockResolvedValue(customer),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Test find customer use case", () => {
    it("should find a customer", async () => {
        const repo = MockRepository();
        const useCase = new FindCustomerUseCase(repo);

        const input = { id: "123" };
        const output = {
            id: "123",
            name: "Johny",
            address: {
                street: "street",
                city: "city",
                number: 123,
                zip: "zip",
            },
        };
        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });
    
    it("should throw if a customer is not found", async () => {
        const repo = MockRepository();
        repo.find.mockRejectedValue(new Error("Customer not found"));
        
        const useCase = new FindCustomerUseCase(repo);
        const input = { id: "123" };
        
        await expect(useCase.execute(input)).rejects.toThrow("Customer not found");
        
    });
});

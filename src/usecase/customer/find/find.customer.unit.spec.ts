import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import { FindCustomerUseCase } from "./find.customer.usecase";

describe("Test find customer use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a customer", async () => {
        const customerRepo = new CustomerRepository();
        const useCase = new FindCustomerUseCase(customerRepo);
        
        const customer = new Customer("123", "Johny");
        const address = new Address("street", 123, "zip", "city");
        customer.changeAddress(address);
        
        await customerRepo.create(customer);

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
});

import { InputCreateCustomerDTO } from "./create.customer.dto";
import CreateCustomerUseCase from "./create.customer.usecase";

const input: InputCreateCustomerDTO = {
    name: "Johny",
    address: {
        street: "street",
        city: "city",
        number: 123,
        zip: "zip",
    },
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test create customer use case", () => {
    it("should create a customer", async () => {
        const repo = MockRepository();
        const useCase = new CreateCustomerUseCase(repo);

        const output = await useCase.execute(input);

        expect(repo.create).toBeCalledTimes(1);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                zip: input.address.zip,
            },
        });
    });

    it("should throw an error when name is missing", async () => {
        const repo = MockRepository();
        const useCase = new CreateCustomerUseCase(repo);

        const inputWithoutName = { ...input, name: "" };

        await expect(useCase.execute(inputWithoutName)).rejects.toThrowError(
            "Name is required",
        );
    });

    it("should throw an error when street is missing", async () => {
        const repo = MockRepository();
        const useCase = new CreateCustomerUseCase(repo);

        const inputWithoutStreet = {
            ...input,
            address: { ...input.address, street: "" },
        };

        await expect(useCase.execute(inputWithoutStreet)).rejects.toThrowError(
            "Street is required",
        );
    });
});

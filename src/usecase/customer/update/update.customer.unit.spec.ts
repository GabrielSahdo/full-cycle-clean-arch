import Customer from "../../../domain/customer/entity/customer";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDTO } from "./update.customer.dto";
import { UpdateCustomerUseCase } from "./update.customer.usecase";

let customer: Customer;
let input: InputUpdateCustomerDTO;
let MockRepository: jest.Mock;

beforeEach(() => {
    customer = CustomerFactory.createWithAddress(
        "John",
        new Address("street", 123, "zip", "city"),
    );

    input = {
        id: customer.id,
        name: "John Updated",
        address: {
            street: "new street",
            city: "new city",
            number: 321,
            zip: "new zip",
        },
    };

    MockRepository = jest.fn(() => {
        return {
            find: jest.fn().mockResolvedValue(customer),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Unit test update customer use case", () => {
    it("should update a customer", async () => {
        const repo = MockRepository();
        const useCase = new UpdateCustomerUseCase(repo);

        const output = await useCase.execute(input);

        expect(repo.find).toBeCalledTimes(1);
        expect(repo.update).toBeCalledTimes(1);
        expect(output).toEqual({
            id: customer.id,
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                zip: input.address.zip,
            },
        });
    });

    it("should throw an error when name is empty", async () => {
        const repo = MockRepository();
        const useCase = new UpdateCustomerUseCase(repo);

        const inputEmptyName = { ...input, name: "" };

        await expect(useCase.execute(inputEmptyName)).rejects.toThrowError(
            "Name is required",
        );
    });

    it("should throw an error when street is empty", async () => {
        const repo = MockRepository();
        const useCase = new UpdateCustomerUseCase(repo);

        const inputEmptyStreet = {
            ...input,
            address: { ...input.address, street: "" },
        };

        await expect(useCase.execute(inputEmptyStreet)).rejects.toThrowError(
            "Street is required",
        );
    });

    it("should throw an error when city is empty", async () => {
        const repo = MockRepository();
        const useCase = new UpdateCustomerUseCase(repo);

        const inputEmptyCity = {
            ...input,
            address: { ...input.address, city: "" },
        };

        await expect(useCase.execute(inputEmptyCity)).rejects.toThrowError(
            "City is required",
        );
    });

    it("should throw an error when zip is empty", async () => {
        const repo = MockRepository();
        const useCase = new UpdateCustomerUseCase(repo);

        const inputEmptyZip = {
            ...input,
            address: { ...input.address, zip: "" },
        };
        console.log(inputEmptyZip);

        await expect(useCase.execute(inputEmptyZip)).rejects.toThrowError(
            "Zip is required",
        );
    });
});

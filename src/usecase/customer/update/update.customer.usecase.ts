import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../domain/customer/value-object/address";
import { InputUpdateCustomerDTO, OutputUpdateCustomerDTO } from "./update.customer.dto";

export class UpdateCustomerUseCase {
    constructor(
        private readonly customerRepository: CustomerRepositoryInterface,
    ) {}

    async execute(
        input: InputUpdateCustomerDTO,
    ): Promise<OutputUpdateCustomerDTO> {
        const customer = await this.customerRepository.find(input.id);

        customer.changeName(input.name);
        customer.changeAddress(
            new Address(
                input.address.street,
                input.address.number,
                input.address.zip,
                input.address.city,
            ),
        );

        await this.customerRepository.update(customer);

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.Address.street,
                city: customer.Address.city,
                number: customer.Address.number,
                zip: customer.Address.zip,
            },
        };
    }
}

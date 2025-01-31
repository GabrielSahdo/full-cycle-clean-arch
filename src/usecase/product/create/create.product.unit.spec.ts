import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

describe("Unit test for Create Product UseCase", () => {
    let repository: jest.Mocked<any>;
    let inputTypeA: InputCreateProductDto;
    let inputTypeB: InputCreateProductDto;

    beforeEach(() => {
        repository = {
            create: jest.fn(),
            find: jest.fn(),
            findByName: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
        };

        inputTypeA = {
            type: "a",
            name: "Product A",
            price: 10,
        };

        inputTypeB = {
            type: "b",
            name: "Product B",
            price: 20,
        };
    });

    it("should create a product of type A", async () => {
        repository.findByName.mockResolvedValue(null);
        repository.create.mockResolvedValue(null);
        
        const useCase = new CreateProductUseCase(repository);
        const output = await useCase.execute(inputTypeA);

        const expectedOutput: OutputCreateProductDto = {
            id: expect.any(String),
            name: inputTypeA.name,
            price: inputTypeA.price,
        };

        expect(output).toEqual(expectedOutput);
    });
    
    it("should create a product of type B", async () => {
        repository.findByName.mockResolvedValue(null);
        repository.create.mockResolvedValue(null);
        
        const useCase = new CreateProductUseCase(repository);
        const output = await useCase.execute(inputTypeB);

        const expectedOutput: OutputCreateProductDto = {
            id: expect.any(String),
            name: inputTypeB.name,
            price: inputTypeB.price * 2,
        };

        expect(output).toEqual(expectedOutput);
    });
});

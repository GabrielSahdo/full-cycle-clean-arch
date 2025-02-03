import Product from "../../../domain/product/entity/product";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

describe("Find Product use case unit test", () => {
    let repo: jest.Mocked<any>;

    beforeEach(() => {
        repo = {
            create: jest.fn(),
            find: jest.fn(),
            findByName: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should find a product", async () => {
        const returnedProduct = new Product("1", "Product 1", 10);
        const input: InputFindProductDto = {
            id: returnedProduct.id,
        };
        const expectedOutput: OutputFindProductDto = {
            id: returnedProduct.id,
            name: returnedProduct.name,
            price: returnedProduct.price,
        };
        repo.find.mockResolvedValue(returnedProduct);
        const useCase = new FindProductUseCase(repo);

        const output = await useCase.execute(input);

        expect(output).toEqual(expectedOutput);
    });

    it("should throw error if product not found", () => {
        const input: InputFindProductDto = {
            id: "1",
        };
        repo.find.mockRejectedValue(new Error("Product not found"));
        const useCase = new FindProductUseCase(repo);

        expect(useCase.execute(input)).rejects.toThrowError(
            "Product not found",
        );
    });
});

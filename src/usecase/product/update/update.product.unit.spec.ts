import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import {
    InputUpdateProductDto,
    OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

function makeMockProductRepository() {
    return {
        find: jest.fn(),
        findByName: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
    };
}

describe("Update Product Unit Test", () => {
    let mockProductRepository = makeMockProductRepository();

    beforeEach(() => {
        mockProductRepository = makeMockProductRepository();
    });

    it("should update a product", async () => {
        const input: InputUpdateProductDto = {
            id: "1",
            name: "Product 1 Updated",
            price: 20,
        };
        const expectedOutput: OutputUpdateProductDto = {
            id: input.id,
            name: input.name,
            price: input.price,
        };
        const existingProduct = new Product(input.id, input.name, input.price);

        mockProductRepository.findByName.mockResolvedValueOnce(null);
        mockProductRepository.find.mockResolvedValueOnce(existingProduct);
        mockProductRepository.update.mockResolvedValueOnce(null);

        const updateProductUseCase = new UpdateProductUseCase(
            mockProductRepository,
        );
        const result = await updateProductUseCase.execute(input);

        expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the product does not exist", async () => {
        const input: InputUpdateProductDto = {
            id: "1",
            name: "Product 1 Updated",
            price: 20,
        };

        mockProductRepository.find.mockRejectedValueOnce(
            new Error("Product not found"),
        );

        const updateProductUseCase = new UpdateProductUseCase(
            mockProductRepository,
        );

        await expect(updateProductUseCase.execute(input)).rejects.toThrow(
            "Product not found",
        );
    });

    it("should throw an error when the product name already exists", async () => {
        const product1 = ProductFactory.create("a", "Product 1", 10);
        const product2 = ProductFactory.create("a", "Product 2", 20);

        const input: InputUpdateProductDto = {
            id: product2.id,
            name: product1.name,
            price: product2.price,
        };

        mockProductRepository.find.mockResolvedValueOnce(product2);
        mockProductRepository.findByName.mockResolvedValueOnce(product1);

        const updateProductUseCase = new UpdateProductUseCase(
            mockProductRepository,
        );

        await expect(updateProductUseCase.execute(input)).rejects.toThrow(
            "Product name already exists",
        );
    });
});

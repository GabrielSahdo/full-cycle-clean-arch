import Product from "../../../domain/product/entity/product";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";
import ListProductUseCase from "./list.product.usecase";

describe("List Products use case unit test", () => {
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
        const input: InputListProductDto = {};
        const expectedOutput: OutputListProductDto = {
            products: [
                {
                    id: returnedProduct.id,
                    name: returnedProduct.name,
                    price: returnedProduct.price,
                },
            ],
        };
        repo.findAll.mockResolvedValue([returnedProduct]);
        const useCase = new ListProductUseCase(repo);

        const output = await useCase.execute(input);

        expect(output).toEqual(expectedOutput);
    });
});

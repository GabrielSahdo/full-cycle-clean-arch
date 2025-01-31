import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

describe("Update Product Integration Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const repo = new ProductRepository();
        const useCase = new UpdateProductUseCase(repo);
        const newProduct = ProductFactory.create("a", "Product 1", 10);
        await repo.create(newProduct);

        const input: InputUpdateProductDto = {
            id: newProduct.id,
            name: "Product 1 Updated",
            price: 20,
        };

        const expectedOutput: OutputUpdateProductDto = {
            id: input.id,
            name: input.name,
            price: input.price,
        };

        const output = await useCase.execute(input);

        expect(output).toEqual(expectedOutput);
    });
    
    it("should throw an error when trying to update a non-existing product", async () => {
        const repo = new ProductRepository();
        const useCase = new UpdateProductUseCase(repo);

        const input: InputUpdateProductDto = {
            id: "non-existing-id",
            name: "Product 1 Updated",
            price: 20,
        };

        await expect(useCase.execute(input)).rejects.toThrowError(
            "Product not found",
        );
    });
    
    it("should throw an error when trying to update a name that already exists", async () => {
        const repo = new ProductRepository();
        const useCase = new UpdateProductUseCase(repo);
        const newProduct1 = ProductFactory.create("a", "Product 1", 10);
        await repo.create(newProduct1);
        const newProduct2 = ProductFactory.create("a", "Product 2", 20);
        await repo.create(newProduct2);

        const input: InputUpdateProductDto = {
            id: newProduct1.id,
            name: newProduct2.name,
            price: 20,
        };

        await expect(useCase.execute(input)).rejects.toThrowError(
            "Product name already exists",
        );
    });
});

import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { OutputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

describe("Find Product Usecase Integration Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            models: [ProductModel],
            sync: { force: true },
        });
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product by id", async () => {
        const product = ProductFactory.create("a", "Product 1", 10);
        const repo = new ProductRepository();
        const useCase = new FindProductUseCase(repo);
        await repo.create(product);
        const expectedOutput: OutputFindProductDto = {
            id: product.id,
            name: product.name,
            price: product.price,
        };

        const ouput = await useCase.execute({ id: product.id });

        expect(ouput).toEqual(expectedOutput);
    });

    it("should throw an error when product not found", async () => {
        const repo = new ProductRepository();
        const useCase = new FindProductUseCase(repo);

        await expect(
            useCase.execute({ id: "invalid-id" }),
        ).rejects.toThrowError("Product not found");
    });
});

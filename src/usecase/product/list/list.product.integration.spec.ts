import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { OutputListProductDto } from "./list.product.dto";
import ListProductUseCase from "./list.product.usecase";

describe("List Products Usecase Integration Test", () => {
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
        const useCase = new ListProductUseCase(repo);
        await repo.create(product);
        const expectedOutput: OutputListProductDto = {
            products: [
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                },
            ],
        };

        const output = await useCase.execute({});

        expect(output).toEqual(expectedOutput);
    });
});

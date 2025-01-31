import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductB from "../../../domain/product/entity/product-b";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

describe("Unit test for Create Product UseCase", () => {
    let inputTypeA: InputCreateProductDto;
    let inputTypeB: InputCreateProductDto;
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

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product of type A", async () => {
        const repository = new ProductRepository();
        const useCase = new CreateProductUseCase(repository);

        const expectedProduct = new Product(
            "does-not-matter",
            inputTypeA.name,
            inputTypeA.price,
        );
        const expectedOutput: OutputCreateProductDto = {
            id: expect.any(String),
            name: expectedProduct.name,
            price: expectedProduct.price,
        };

        const output = await useCase.execute(inputTypeA);
        expect(output).toEqual(expectedOutput);
    });

    it("should create a product of type B", async () => {
        const repository = new ProductRepository();
        const useCase = new CreateProductUseCase(repository);

        const expectedProduct = new ProductB(
            "does-not-matter",
            inputTypeB.name,
            inputTypeB.price,
        );
        const expectedOutput: OutputCreateProductDto = {
            id: expect.any(String),
            name: expectedProduct.name,
            price: expectedProduct.price,
        };

        const output = await useCase.execute(inputTypeB);

        expect(output).toEqual(expectedOutput);
    });

    it("should throw an error when product name already exists", async () => {
        const repository = new ProductRepository();
        const useCase = new CreateProductUseCase(repository);

        await repository.create(new Product("123", inputTypeA.name, 10));

        await expect(useCase.execute(inputTypeA)).rejects.toThrow(
            "Product already exists",
        );
    });
});

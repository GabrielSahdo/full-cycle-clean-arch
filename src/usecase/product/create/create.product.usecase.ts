import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "./create.product.dto";

export default class CreateProductUseCase {
    constructor(private repository: ProductRepositoryInterface) {}

    async execute(
        input: InputCreateProductDto,
    ): Promise<OutputCreateProductDto> {
        const product = ProductFactory.create(
            input.type,
            input.name,
            input.price,
        );

        const existingProduct = await this.repository.findByName(product.name);
        if (existingProduct) {
            throw new Error("Product already exists");
        }

        await this.repository.create(product);

        return {
            id: product.id,
            name: product.name,
            price: product.price,
        };
    }
}

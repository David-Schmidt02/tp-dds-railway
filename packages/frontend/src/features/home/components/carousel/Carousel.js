import './Carousel.css';


const Carousel = () => {
    return (
        <div className="categoria-carousel">
            {categorias.map((categoria) =>
                <ProductItem aProduct = {categoria} key={categoria.id} />
            )}
        </div>
    )

};

export default Carousel;
import './CarouselCategoria.css';
import CategoriaItem from '../categoria/CategoriaItem.jsx';

const CarouselCategoria = ({ categories}) => {
    return (
        <>
            <div className="categoria-carousel">
                {categories.map((category) =>
                    <CategoriaItem categoria={category} key={category.id} />
                )}
            </div>
        </>
    );

};

export default CarouselCategoria;
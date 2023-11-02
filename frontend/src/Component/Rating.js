import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
library.add(fasFaStar, farFaStar, faStarHalfAlt);

function Rating(props) {
	const { rating, numReviews, caption } = props;
	return (
		<div className="rating">
			<span>
				<FontAwesomeIcon icon={rating >= 1 ? fasFaStar : rating >= 0.5 ? faStarHalfAlt : farFaStar} />
			</span>

			<span>
				<FontAwesomeIcon icon={rating >= 2 ? fasFaStar : rating >= 1.5 ? faStarHalfAlt : farFaStar} />
			</span>

			<span>
				<FontAwesomeIcon icon={rating >= 3 ? fasFaStar : rating >= 2.5 ? faStarHalfAlt : farFaStar} />
			</span>

			<span>
				<FontAwesomeIcon icon={rating >= 4 ? fasFaStar : rating >= 3.5 ? faStarHalfAlt : farFaStar} />
			</span>

			<span>
				<FontAwesomeIcon icon={rating >= 5 ? fasFaStar : rating >= 4.5 ? faStarHalfAlt : farFaStar} />
			</span>
			{caption ? <span>{caption}</span> : <span> {' ' + numReviews + ' reviews'} </span>}
		</div>
	);
}

export default Rating;

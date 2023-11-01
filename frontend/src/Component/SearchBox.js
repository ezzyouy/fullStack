import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBox() {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const submitHandler = async (e) => {
		e.preventDefault();
		navigate(query ? `/search?query=${query}` : '/search');
	};
	return (
		<Form className="d-flex me-auto" onSubmit={submitHandler}>
			<InputGroup>
				<FormControl
					type="text"
					name="q"
					id="q"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="search products..."
					aria-label="Search Products"
					aria-describedby="button-search"
				></FormControl>
				<Button className="btn-outline-primary" variant="outline-primary" type="submit" id="button-search">
					<FontAwesomeIcon icon={faSearch} />
				</Button>
			</InputGroup>
		</Form>
	);
}

export default SearchBox;

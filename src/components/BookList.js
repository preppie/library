import React, { useEffect, useState } from "react";
import { getAllBooks, addBook, deleteBook, rentBook, returnBook } from "../services/bookService";


const BookList = () => {
    const [books, setBooks] = useState([]);
    const [newBookTitle, setNewBookTitle] = useState('');
    const [newBookAuthor, setNewBookAuthor] = useState('');
    const [rentPeriod, setRentPeriod] = useState('');


    //Fetch books from the backend or mock data 
    const fetchBooks = async () => {
        try {
            const data = await getAllBooks();
            console.log('asgasgasg', data)
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        //Call a function to fetch book and update the state
        fetchBooks();
    }, []);


    const handleAddBook = async () => {
        try {
            const newBook = { title: newBookTitle, author: newBookAuthor, available: true };
            const addedBook = await addBook(newBook);
            setBooks([...books, addedBook]);
            setNewBookTitle('');
            setNewBookAuthor('');
        } catch (error) {
            console.log('Error adding book:', error);
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            await deleteBook(id);
            const updateBooks = books.filter((book) => book.id !== id);
            setBooks(updateBooks);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleRentBook = async (id, rentPeriod) => {
        try {
            const bookToRent = books.find((book) => book.id === id);
            if (!bookToRent.available) {
                console.log('This book is already rented out');
                return;
            }
            // Rent out the book for a specific period of time (in days)
            await rentBook(id, rentPeriod);
            const updatedBooks = books.map((book) =>
                book.id === id ? { ...book, available: false } : book
            );
            setBooks(updatedBooks);
            console.log('Book rented successfully');
        } catch (error) {
            console.error('Error renting book:', error);
        }
    };

    const handleReturnBook = async (id) => {
        try {
            await returnBook(id); // Call the returnBook function
            const updatedBooks = books.map((book) => {
                if (book.id === id) {
                    return { ...book, available: true }; // Update the book's availability status
                }
                return book;
            });
            setBooks(updatedBooks); // Update the state wih the updated book list
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    // const calculateRemainingTime = (rentedUntil) => {
    //     console.log("Rented Until:", rentedUntil);
    //     const currentDate = new Date();
    //     console.log("Current Date:", currentDate);
    //     const remainingTime = new Date(rentedUntil) - currentDate;
    //     console.log("Remaining Time:", remainingTime);
    //     const days = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    //     console.log("Days:", days);
    //     return days > 0 ? `${days} days` : 'Available';
    // };

    const calculateRemainingTime = (rentedUntil) => {
        const currentDate = new Date();
        const rentedDate = new Date(rentedUntil.seconds * 1000); // Convert Firestore timestamp to JavaScript Date object
        const remainingTime = rentedDate - currentDate;
        const days = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days` : 'Available';
    };



    // const handleUpdateBook = async (id, updatedBookData) => {
    //     try {
    //         const updatedBook = await updateBook(id, updatedBookData);
    //         const updatedBooks = books.map((book) =>
    //             book.id === updatedBook.id ? updatedBook : book
    //         );
    //         setBooks(updatedBooks);
    //     } catch (error) {
    //         console.error('Error updateing book:', error);
    //     }
    // };



    //Other code for rendering the book list
    return (
        <div>
            <h2>BookList</h2>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {book.title} by {book.author}
                        <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                        {book.available ? (
                            <div>
                                <input
                                    type="number"
                                    placeholder="Rent Period (in days)"
                                    value={rentPeriod}
                                    onChange={(e) => setRentPeriod(e.target.value)}
                                />
                                <button onClick={() => handleRentBook(book.id, rentPeriod)}>Rent</button>
                            </div>
                        ) : (
                            <div>
                                {book.rentedUntil && (
                                    <span>Available in: {calculateRemainingTime(book.rentedUntil)}</span>
                                )}
                                <button onClick={() => handleReturnBook(book.id)}>Return</button>
                            </div>
                        )}

                    </li>
                ))}
            </ul>
            <h2>Add New Book</h2>
            <input
                type="text"
                placeholder="Title"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Author"
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
            />
            <button onClick={handleAddBook}>Add Book</button>
        </div>
    );
};

export default BookList;



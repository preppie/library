import { firestore } from '../firebase.js';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';

// Function to fetch all books
export const getAllBooks = async () => {
    const booksCollection = collection(firestore, 'books');
    const snapshot = await getDocs(booksCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to add new book
export const addBook = async (newBook) => {
    const booksCollection = collection(firestore, 'books');
    const docRef = await addDoc(booksCollection, newBook);
    return { id: docRef.id, ...newBook };
};

// Function to delete a book by id 
export const deleteBook = async (id) => {
    const bookDoc = doc(firestore, 'books', id);
    await deleteDoc(bookDoc);
    return id;
};

// Function to update a book by id
export const updateBook = async (id, updatedBookData) => {
    const bookDoc = doc(firestore, 'books', id);
    await updateDoc(bookDoc, updatedBookData);
    const updatedBookDoc = await getDoc(bookDoc);
    return { id: updatedBookDoc.id, ...updatedBookDoc.data() };
};

// Function to rent out a book by id for a specific period of time
export const rentBook = async (id, rentPeriod) => {
    const rentedUntil = new Date();
    rentedUntil.setDate(rentedUntil.getDate() + parseInt(rentPeriod)); // Calculate the return date
    const updatedBookData = { available: false, rentedUntil: rentedUntil }; // Set the book's availability and return date
    await updateBook(id, updatedBookData); // Update the book's data in the database
};

//Function to retrun a rented book by id
export const returnBook = async (id) => {
    const updatedBookData = { available: true }; // Set the book's availability to true
    await updateBook(id, updatedBookData); // Update the book's data in teh database
};


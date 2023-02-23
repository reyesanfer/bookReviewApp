package com.inerza.ulpgc.bookReview.core.persistence;

import com.inerza.ulpgc.bookReview.model.entities.Book;

import java.util.List;

public interface IBookService {

    List<Book> getBookList(int page, int size, String sortDir, String sort);

    void updateBook(Book book);

    Book createBook(Book book);

    Book getBookById(Long id);

    void deleteBook(Long id);
}

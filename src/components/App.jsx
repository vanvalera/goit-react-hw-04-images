import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import fetchImagesWithQuery from 'services/api';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import css from './App.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export  function App() {
  const [searchData, setSearchData] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [largeImage, setLargeImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (page === 1) {
      setImages([]);
    }

    if (page !== 0 && searchData.trim() !== '') {
      try {
        setIsLoading(true);
        const response = fetchImagesWithQuery(searchData, page);

        response.then(({ data }) => {
          if (data.hits.length === 0) {
            toast.error('Nothing found');
          } else {
            const newImages = data.hits.map(({ id, webformatURL, largeImageURL }) => ({
              id,
              webformatURL,
              largeImageURL,
            }));

            setImages(prevImages => [...prevImages, ...newImages]);
            setTotalImages(data.total);
            setIsLoading(false);
          }
        });
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
  }, [page, searchData]);

  const onSubmit = newSearchData => {
    if (newSearchData.trim() === '') {
      toast.error('Enter the meaning for search');
      return;
    }

    if (newSearchData === searchData) {
      return;
    }

    setSearchData(newSearchData);
    setPage(1);
  };

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = index => {
    setShowModal(true);
    setLargeImage(images[index].largeImageURL);
  };

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={onSubmit} />
      {images.length !== 0 && <ImageGallery images={images} openModal={openModal} />}
      {showModal && <Modal toggleModal={toggleModal} largeImage={largeImage} />}
      {isLoading && <Loader />}
      <ToastContainer autoClose={3500} />
      {images.length >= 12 && images.length < totalImages && <Button nextPage={nextPage} />}
    </div>
  );
}

import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import noPreview from "../../../assets/img/img_no_preview.png";
import Modal from "react-bootstrap/Modal";

const BookDetails = ({ modal, setModal, bookDetails }: any) => {
  return (
    <div className='main'>
      <Modal
        size='lg'
        show={modal}
        onHide={() => setModal(false)}
        aria-labelledby='example-modal-sizes-title-lg'
      >
        <Modal.Header closeButton>
          <Modal.Title id='example-modal-sizes-title-lg'>
            Book Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Img
              variant='top'
              className='img-book h-300'
              src={bookDetails.thumbnail ? bookDetails.thumbnail : noPreview}
            />
            <Card.Body>
              {bookDetails.title ? (
                <Card.Title>{bookDetails.title}</Card.Title>
              ) : null}
              {bookDetails.categories ? (
                <p className='mb-1'>
                  <b>Categories</b> : {bookDetails.categories}
                </p>
              ) : null}
              {bookDetails.authors ? (
                <p className='mb-1'>
                  <b>Authors</b> : {bookDetails.authors}
                </p>
              ) : null}
              {bookDetails.publishedDate ? (
                <p className='mb-1'>
                  <b>Published Date</b> : {bookDetails.publishedDate}
                </p>
              ) : null}
              {bookDetails.publisher ? (
                <p className='mb-1'>
                  <b>Publisher</b> : {bookDetails.publisher}
                </p>
              ) : null}
              <Card.Text>
                {bookDetails.description ? bookDetails.description : null}
              </Card.Text>
              <Card.Text className='text-right'>
                {bookDetails.link ? (
                  <a
                    className='btn btn-primary'
                    href={bookDetails.link}
                    target='_blank'
                  >
                    More Details
                  </a>
                ) : null}
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BookDetails;

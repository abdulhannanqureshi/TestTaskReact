import React, { useEffect } from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import defaultImage from "../../../assets/img/default_image.jpg";
import { ImageURL } from "../../../config/AppConfig";
import { Editor } from "react-draft-wysiwyg";

const TeamForm = (props: any) => {

  return (
    <Form onSubmit={props.handleSubmit} className="custom-editor">
      <div className='row'>
        <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            First Name<span className={"mandatory"}>*</span>
            &nbsp;
          </Form.Label>
          <InputGroup>
            <input
              type='text'
              name='firstName'
              value={props.form.firstName}
              className={"form-control floating-input"}
              placeholder={" "}
              onChange={props.handleChange}
            />
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.firstName}
          </div>
        </Form.Group>
        <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            Last Name<span className={"mandatory"}>*</span>
            &nbsp;
          </Form.Label>
          <InputGroup>
            <input
              type='text'
              name='lastName'
              value={props.form.lastName}
              className={"form-control floating-input"}
              placeholder={" "}
              onChange={props.handleChange}
            />
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.lastName}
          </div>
        </Form.Group>
        {/* <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            Email<span className={"mandatory"}>*</span>
            &nbsp;
          </Form.Label>
          <InputGroup>
            <input
              type='text'
              name='email'
              value={props.form.email}
              className={"form-control floating-input"}
              placeholder={" "}
              onChange={props.handleChange}
            />
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.email}
          </div>
        </Form.Group> */}
        
        <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            Upload Profile Image
          </Form.Label>
          <InputGroup>
            <div className='fileinput-preview team-img-upload'>
              <img
                src={
                  props.imagePreview
                    ? props.imagePreview.startsWith("data")
                      ? props.imagePreview
                      : `${ImageURL}/${props.imagePreview}`
                    : defaultImage
                }
                alt={"Profile Preview"}
              />
              <div className='file-upload'>
                <label htmlFor={`feature-image`} className='file-upload-label'>
                  Choose Image
                </label>
                <input
                  className='file-upload-input'
                  type='file'
                  accept='image/*'
                  name='teamMemberImage'
                  ref={props.useRef}
                  id={`feature-image`}
                  onChange={props.handleFile}
                />
              </div>
              {props.imagePreview && props.imagePreview.length ? (
                <div className='remove_icon_wrapper'>
                  <i
                    className='fa fa-trash-o trash_icon'
                    onClick={props.removeImage}
                    aria-hidden='true'
                  />
                </div>
              ) : null}
            </div>
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.teamMemberImage}
          </div>
        </Form.Group>
        <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            About Us<span className={"mandatory"}>*</span>
            &nbsp;
          </Form.Label>
          <InputGroup>
            <Editor
              toolbarClassName='toolbarClassName'
              wrapperClassName='demo-wrapper'
              editorClassName='demo-home-editor'
              editorState={props.form.editorState}
              onEditorStateChange={props.handleChangeEditor}
            />
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.aboutUs}
          </div>
        </Form.Group>
        <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            Designation<span className={"mandatory"}>*</span>
            &nbsp;
          </Form.Label>
          <InputGroup>
            <input
              type='text'
              name='designation'
              value={props.form.designation}
              className={"form-control floating-input"}
              placeholder={" "}
              onChange={props.handleChange}
            />
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.designation}
          </div>
        </Form.Group>
        {/* {
          props.type=="add" ? 
          <Form.Group className='col-sm-6'>
          <Form.Label className='floating-label'>
            Order Number<span className={"mandatory"}>*</span>
            &nbsp;
          </Form.Label>
         
          <InputGroup>
            <input
              type='text'
              name='order'
              value={props.form.order}
              className={"form-control floating-input"}
              placeholder={" "}
              onChange={props.handleChange}
            />
          </InputGroup>
          <div className={"text-danger error-text"}>
            {props.error && props.error.order}
          </div>
        </Form.Group>
        :
        null
        } */}
       
      </div>
      <Col xs='12' className='text-right'>
        <Button
          variant='button'
          className='btn btn-danger'
          onClick={() => {
            props.history.go(-1);
          }}
        >
          {" "}
          Cancel
        </Button>
        &nbsp;
        <Button variant='button' type={"submit"} className='btn btn-primary'>
          {props.buttonType}
        </Button>
      </Col>
    </Form>
  );
};

export default TeamForm;

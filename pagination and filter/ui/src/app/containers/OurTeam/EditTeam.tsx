import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col } from "react-bootstrap";
import { OurTeamEdit } from "../../../validator";
import { viewOurTeamRequest, editOurTeamRequest } from "../../../actions";
import TeamForm from "./TeamForm";
// For Text Editor
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const EditTeam = (props: any) => {
  const imgRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const defaultForm = {
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    order:"",
    aboutUs: "",
    teamMemberImage: "",
    id: props.match.params.id,
    // For Text Editor
    editorState: EditorState.createEmpty(),
  };
  const defaultError = {
    firstName: "",
    lastName: "",
    email: "",
    order:"",
    designation: "",
    aboutUs: "",
    teamMemberImage: "",
  };
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState(defaultError);

  useEffect(() => {
    dispatch(viewOurTeamRequest(defaultForm.id));
  }, []);

  const { ourTeamView } = useSelector((state: any) => state.ourTeamReducer);
  useEffect(() => {
    if (ourTeamView) {
      const contentBlock = htmlToDraft(
        ourTeamView.aboutUs ? ourTeamView.aboutUs : "<p></p>"
      );
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const mainSectionContent = EditorState.createWithContent(contentState);

      setForm({
        ...form,
        firstName: ourTeamView.firstName,
        lastName: ourTeamView.lastName,
        email: ourTeamView.email,
        designation: ourTeamView.designation,
        aboutUs: ourTeamView.aboutUs,
        teamMemberImage: ourTeamView.teamMemberImage,
        editorState: mainSectionContent,
      });
      setImagePreview(ourTeamView.teamMemberImage);
    }
  }, [ourTeamView]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // To validate form fields
    const { isValid, errors } = OurTeamEdit({
      ...form,
      teamMemberImage: form.teamMemberImage ? "teamMemberImage" : "",
    });
    if (isValid) {
      dispatch(editOurTeamRequest({ ...form, props }));
    } else {
      setError({ ...error, ...errors });
      return;
    }
  };

  // For Preview
  const [imagePreview, setImagePreview] = useState("");
  const handleFile = (e: any) => {
    let file = e.target.files[0];
    setForm({ ...form, [e.target.name]: file });
    setError({ ...error, [e.target.name]: "" });
    let reader: any = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // for remove preview image
  const removeImage = () => {
    setImagePreview("");
    setForm({ ...form, teamMemberImage: "" });
    let selectFile: any = imgRef.current;
    selectFile.value = "";
  };
  // For Text Editor
  const handleChangeEditor = (editorState: any) => {
    setForm({
      ...form,
      editorState,
      aboutUs: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
    setError({
      ...error,
      aboutUs: "",
    });
  };

  return (
    <div className='cr-page px-3 min-height650 my-profile-section'>
      <Row>
        <Col xs='12' sm='12' lg='12'>
          <Card>
            <Card.Header>
              <h4>
                <i className='icon-note' /> Edit Team Member
              </h4>
            </Card.Header>
            <Card.Body>
              <div className='row'>
                <div className='col-md-12  my-4'>
                  <TeamForm
                    type="edit"
                    form={form}
                    imagePreview={imagePreview}
                    handleChange={handleChange}
                    error={error}
                    handleSubmit={handleSubmit}
                    handleFile={handleFile}
                    removeImage={removeImage}
                    handleChangeEditor={handleChangeEditor}
                    useRef={imgRef}
                    buttonType="Update"
                    {...props}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditTeam;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

const App = () => {
  const [verses, setVerses] = useState([]);
  const [newVerse, setNewVerse] = useState({
    book: '',
    chapter: '',
    verseNumber: '',
    verseText: '',
  });
  const [editVerse, setEditVerse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVerses();
  }, []);

  const fetchVerses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/verses');
      setVerses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addVerse = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/verses', newVerse);
      fetchVerses();
      setNewVerse({
        book: '',
        chapter: '',
        verseNumber: '',
        verseText: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVerse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/verses/${id}`);
      fetchVerses();
    } catch (error) {
      console.error(error);
    }
  };

  const updateVerse = async () => {
    try {
      await axios.put(`http://localhost:5000/verses/${editVerse._id}`, editVerse);
      setEditVerse(null);
      fetchVerses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (verse) => {
    setEditVerse({ ...verse });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditVerse((prevVerse) => ({
      ...prevVerse,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVerses = verses.filter((verse) => {
    return (
      verse.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.verseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verse.verseText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h1 className="text-left">Favorite Bible Verses</h1>
        <Button variant="primary" onClick={toggleForm}>
          {showForm ? 'Cancel' : 'Add Verse'}
        </Button>
      </div>
      <Modal show={showForm} onHide={toggleForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add Verse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addVerse}>
            <Form.Group controlId="formBook">
              <Form.Label>Book</Form.Label>
              <Form.Control
                type="text"
                placeholder="Book"
                value={newVerse.book}
                onChange={(e) => setNewVerse({ ...newVerse, book: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formChapter">
              <Form.Label>Chapter</Form.Label>
              <Form.Control
                type="text"
                placeholder="Chapter"
                value={newVerse.chapter}
                onChange={(e) => setNewVerse({ ...newVerse, chapter: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formVerseNumber">
              <Form.Label>Verse Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Verse Number"
                value={newVerse.verseNumber}
                onChange={(e) => setNewVerse({ ...newVerse, verseNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formVerseText">
              <Form.Label>Verse Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Verse Text"
                value={newVerse.verseText}
                onChange={(e) => setNewVerse({ ...newVerse, verseText: e.target.value })}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggleForm}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Verse
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="text-center mt-4 mx-auto" style={{ maxWidth: '300px' }}>
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Book</th>
            <th>Chapter</th>
            <th>Verse Number</th>
            <th>Verse Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVerses.map((verse) => (
            <tr key={verse._id}>
              {editVerse && editVerse._id === verse._id ? (
                <>
                  <td>
                    <Form.Control
                      type="text"
                      name="book"
                      value={editVerse.book}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="chapter"
                      value={editVerse.chapter}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="verseNumber"
                      value={editVerse.verseNumber}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="verseText"
                      value={editVerse.verseText}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Button variant="primary" onClick={updateVerse}>
                      Save
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{verse.book}</td>
                  <td>{verse.chapter}</td>
                  <td>{verse.verseNumber}</td>
                  <td>{verse.verseText}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleEditClick(verse)}>
                      Edit
                    </Button>
                  </td>
                </>
              )}
              <td>
                <Button variant="danger" size="sm" onClick={() => deleteVerse(verse._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;

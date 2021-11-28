import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-bootstrap-range-slider";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./app.css";
import { FormControl } from "react-bootstrap";

const initialText = `Hi, welcome to spreedy, if you haven't already, click play. This is an app I made when I was revising for my exams. I wanted to see if I could make reading more efficient, and I think this does just that. It doesn't only help slow readers double or even triple their reading speed, but has been tested to work with dyslexia and ADHD too. So here's how it works. At the bottom of your screen you can paste the text you would like to read. Then it's as simple as clicking the play button. If you want to adjust your speed, just move the slider along to change your WPM. If you want to go back, just pause and click on the word you want to start again from. For more information, click our logo at the top of your screen. That's it. I hope you like it.`;

const scrollToCenter = function (id) {
  document.getElementById(id).scrollIntoView({
    behavior: "auto",
    block: "center",
    inline: "center",
  });
};

const timers = [];

function App() {
  const [wordIdx, setwordIdx] = useState(0);
  const [paused, setPaused] = useState(true);
  const [wpm, setWpm] = useState(350);
  const [text, setText] = useState(initialText);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    scrollToCenter("center");
  }, []);

  if (!paused) {
    if (wordIdx === text.split(" ").length - 1) {
      setPaused(true);
    } else {
      console.log();
      timers.push(
        setTimeout(() => {
          setwordIdx(wordIdx + 1);
          scrollToCenter("center");
        }, 60000 / wpm + (text.split(" ")[wordIdx].slice(-1) === "." ? 60000 / wpm : 0)) //
      );
    }
  }

  return (
    <div
      style={{
        margin: "0 auto",
        width: "90vw",
        marginTop: "1rem",
        height: "auto",
      }}
    >
      <Navbar>
        <Navbar.Brand
          onClick={handleShow}
          className="navbar-brand mx-auto"
          style={{ fontWeight: "bold" }}
        >
          <h1>spreedy</h1>
        </Navbar.Brand>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          For future enquires, email daniel@spreedy.app
        </Modal.Footer>
      </Modal>
      <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
        <Card
          style={{
            // width: "50rem",
            fontSize: "2rem",
            height: "60vh",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <Card.Body>
            {[...Array(9).keys()].map((n) => {
              return <br key={n} />;
            })}
            <div className={paused ? "shown" : "hidden"} id="before">
              {text
                .split(" ")
                .slice(0, wordIdx)
                .map((word, i) => {
                  return (
                    <span
                      onClick={(e) => {
                        console.log(e.target);
                        console.log(i);
                        setwordIdx(i);
                        setTimeout(() => scrollToCenter(i), 0);
                      }}
                      id={i}
                      key={i}
                    >{`${word} `}</span>
                  );
                })}
            </div>
            <div id="center">
              <span
                onClick={() => {
                  for (let i = 0; i < timers.length; i++) {
                    clearTimeout(timers[i]);
                  }
                  setPaused(paused ? false : true);
                }}
                id={wordIdx}
              >
                {text.split(" ").slice(wordIdx, wordIdx + 1)}
              </span>
            </div>

            <div className={paused ? "shown" : "hidden"} id="after">
              {text
                .split(" ")
                .slice(wordIdx + 1)
                .map((word, i) => {
                  return (
                    <span
                      onClick={(e) => {
                        console.log(e.target);
                        console.log(i + wordIdx + 1);
                        setwordIdx(i + wordIdx + 1);
                        setTimeout(() => scrollToCenter(i + wordIdx + 1), 0);
                        // setImmediate(() => scrollToCenter(i + wordIdx + 1));
                      }}
                      id={i + wordIdx + 1}
                      key={i + wordIdx + 1}
                    >{`${word} `}</span>
                  );
                })}
            </div>
            {[...Array(9).keys()].map((n) => {
              return <br key={n} />;
            })}
          </Card.Body>
        </Card>

        <Button
          style={{ margin: "2rem" }}
          variant="light"
          onClick={() => {
            if ((wordIdx === text.split(" ").length - 1) & paused) {
              setwordIdx(0);
              setTimeout(() => scrollToCenter(0), 0);
            } else {
              for (let i = 0; i < timers.length; i++) {
                clearTimeout(timers[i]);
              }
              setPaused(paused ? false : true);
            }
          }}
        >
          {/* {paused ? "▶️" : "⏸️"} */}
          {paused ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-play"
              viewBox="0 0 16 16"
            >
              <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-pause"
              viewBox="0 0 16 16"
            >
              <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
            </svg>
          )}
        </Button>
      </div>

      <RangeSlider
        variant="secondary"
        min={60}
        max={800}
        value={wpm}
        onChange={(e) => {
          for (let i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
          }
          setWpm(e.target.value);
        }}
      />
      <Form
        style={{ marginBottom: "2rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          for (let i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
          }
          setText(e.target[0].value);
          setwordIdx(0);
        }}
      >
        <FormControl
          placeholder="Paste the text you want to read in here"
          style={{ textAlign: "center" }}
        ></FormControl>
      </Form>
    </div>
  );
}

export default App;

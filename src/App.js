import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-bootstrap-range-slider";
import "./app.css";

const text = `Reading is becoming more and more important in the new knowledge economy and remains the most effective human activity for transforming information into knowledge. If top readers read at speeds of above 1000 words per minute (wpm) with near 85% comprehension, they only represent 1% of readers. Average readers are the majority and only reach around 200 wpm with a typical comprehension of 60%. This seems surprising since most readers, actively reading work documents, newspapers, magazines, books or the contents of a computer display are practicing daily for at least one hour. With such an intense training everyone should be close to top performances. Unfortunately, this is far from the real situation. The average reader is five times slower than the good reader. Things are even worse if we consider reading efficiency as well as speed. Compare the results of the average reader to other areas. We may imagine a sprinter practicing every day for several years on the running track and then just calmly walking for a race. We can also picture a racing driver never exceeding 30 mph or a pianist playing every day of the week for 20 years and only able to play music like a beginner. Unfortunately, since the age of 12, most readers do not substantially improve their efficiency and never reach their full capacity. Every computer-user who is also a slow typist is aware of the benefits he could obtain with a typing course, but nearly no one suspects the much higher profits he could reach by improving his reading comprehension and speed. The rapid improvement of voice recognition may gradually make typing virtuosity obsolete since a good typist performs well under the speed of speech. On the other hand, human or computer speaking, with an average speed of 150 wpm, will always remain many times slower than a good reader, without any consideration of the skimming and skipping possibilities.`;

const scrollToCenter = function (id) {
  document.getElementById(id).scrollIntoView({
    behavior: "auto",
    block: "center",
    inline: "center",
  });
  console.log("scrolling to ", id);
};

const timers = [];

function App() {
  const [wordIdx, setwordIdx] = useState(0);
  const [paused, setPaused] = useState(true);
  const [wpm, setWpm] = useState(400);

  useEffect(() => {
    console.log("bruh");
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
          console.log(wordIdx);
          scrollToCenter("center");
        }, 60000 / wpm) //  + (text.split(" ")[wordIdx].slice(-1) === "." ? wpm / 2 : 0)
      );
      // setExtraTime(0);
    }
  }

  return (
    <>
      <div style={{ marginLeft: "36rem" }}>
        <Card
          style={{
            width: "50rem",
            fontSize: "2rem",
            height: "50rem",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <Card.Body>
            {[...Array(8).keys()].map((n) => {
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
                        // setImmediate(() => scrollToCenter(i));
                      }}
                      id={i}
                      key={i}
                    >{`${word} `}</span>
                  );
                })}
            </div>
            <div id="center">
              <span id={wordIdx}>
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
            {[...Array(8).keys()].map((n) => {
              return <br key={n} />;
            })}
          </Card.Body>
        </Card>

        <Button
          variant="secondary"
          onClick={() => {
            for (let i = 0; i < timers.length; i++) {
              clearTimeout(timers[i]);
            }
            setPaused(paused ? false : true);
          }}
        >
          {paused ? "▶️" : "⏸️"}
        </Button>
      </div>

      <RangeSlider
        size=""
        min={60}
        max={800}
        value={wpm}
        onChange={(e) => setWpm(e.target.value)}
      />
      {/* <Button onClick={() => scrollToCenter(4)}>Go to and</Button> */}
    </>
  );
}

export default App;

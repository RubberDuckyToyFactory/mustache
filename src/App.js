import React, { useState }  from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import pronouns_json from './pronouns.json';


let pronouns=shuffle(Object.keys(pronouns_json));

function GameInit({initGame}) {
  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");
  const [validated, setValidated] = useState(false);

  function handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      initGame([playerOne,playerTwo]);
    }

    setValidated(true);

  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Row lg={3} className="p-2 g-3 justify-content-center ">
      <Form.Group as={Col} controlId="player_one">
        <Form.Label>Player One</Form.Label>
        <Form.Control
          required
          type="text"
          onChange={({target:{value}}) => setPlayerOne(value.toUpperCase())}
          autoComplete="off"
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      </Form.Group>
    </Row>
    <Row lg={3} className="p-2 g-3 justify-content-center ">
      <Form.Group as={Col} controlId="player_two">
        <Form.Label>Player Two</Form.Label>
          <Form.Control
            required
            type="text"
            onChange={({target:{value}}) => setPlayerTwo(value.toUpperCase())}
            autoComplete="off"
          />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      </Form.Group>
    </Row>
    <Row lg={3} className="p-2 g-3 justify-content-center ">
      <Form.Group as={Col} controlId="submit">
        <Button type="submit">Start Game!</Button>
      </Form.Group> 
    </Row>
    </Form>
  );
}

function ScoreBoard({score, togglePlayer, playerNames}) {

  let playerOne, playerTwo = null;
  if(!togglePlayer){
    playerOne = <Col key="player1" className="players_turn">{playerNames[0]}</Col>;
    playerTwo = <Col key="player2" className="player">{playerNames[1]}</Col>;
  } else {
    playerOne = <Col key="player1" className="player">{playerNames[0]}</Col>;
    playerTwo = <Col key="player2" className="players_turn">{playerNames[1]}</Col>;
  }
  return (
    <Row key="scoreboard" lg={3}>
      {playerOne}
      <Col key="score" className="score"> {score[0].score} | {score[1].score}</Col>
      {playerTwo}
    </Row>
  );
}

function Card({value, onCardClick, status, isMatchCheck, checkMatch}) {
  if(isMatchCheck){
    return <button className={"game_card_selected"} onClick={onCardClick}>
      <div className={"guess"} onClick={()=>checkMatch(true)}>YES</div>
      <div>&nbsp;</div>
      <div>{value}</div>
      <div>&nbsp;</div>
      <div className={"guess"} onClick={()=>checkMatch(false)}>NO</div> 
    </button>
  } else {
    if(status===1) {
      return <button className={"game_card_selected"} onClick={onCardClick}>
        <div>{value}</div>
      </button>
    } else if (status===0) {
      return <button className={"game_card"} onClick={onCardClick}>
        <div>{value}</div>
      </button>
    } else {
      return <button className={"no_game_card"} ></button>
    }
  }
}

function Board({cards, onPlay, flippedCards, score, togglePlayer, playerNames}) {

  let board=[[]];
  let board_cards = [];

  function matchCheck(myGuess) {
    const newScore = score.at(togglePlayer);
    const isMatch = checkForMatches(flippedCards);
    const flippedCardOne = cards.find(
      c => c.id === flippedCards[0].id
    );
    const flippedCardTwo = cards.find(
      c => c.id === flippedCards[1].id
    );
    if(isMatch === true && myGuess === true){
      flippedCardOne.status = 2; 
      flippedCardTwo.status = 2; 
      console.log("You got it right!");
      if(flippedCardTwo.pronoun==="dad" || flippedCardTwo.pronoun==="school") {
        newScore.score=newScore.score+5;
      } else {
        newScore.score=newScore.score+1;
      }
      togglePlayer=!togglePlayer;      

    } else if(isMatch === false && myGuess === false){
      flippedCardOne.status = 0; 
      flippedCardOne.pronoun = "";
      flippedCardTwo.status = 0; 
      flippedCardTwo.pronoun = "";
      console.log("Correct! They do not match.");
    } else if(isMatch === true && myGuess === false){
      flippedCardOne.status = 0; 
      flippedCardOne.pronoun = "";
      flippedCardTwo.status = 0; 
      flippedCardTwo.pronoun = "";
      console.log("SORRY! They do match.");
    } else {
      flippedCardOne.status = 0; 
      flippedCardOne.pronoun = "";
      flippedCardTwo.status = 0; 
      flippedCardTwo.pronoun = "";
      newScore.score=newScore.score - 1;
      console.log("SORRY! They do not match.");
    }
    onPlay(cards, [], score, !togglePlayer);
  }

  function handleClick(index) {
    const flippedCard = cards.find(
      c => c.id === index
    );
    if(flippedCard.status !== 0 || flippedCards.length===2){
      return;
    } else {
      flippedCard.status = 1;
      flippedCard.pronoun = pronouns[index];  
      onPlay(cards, [...flippedCards, flippedCard], score, togglePlayer);
    }
  }

  let flippedId = -1;
  if(flippedCards.length===2){
    flippedId = flippedCards[1].id;
  }
  cards.forEach((card,index)=>{

    let currentCard = <Card key={"card"+index} 
                  value={card.pronoun} 
                  onCardClick={()=>handleClick(index)}
                  status={card.status}
                  isMatchCheck={false}/>
    
    if(index === flippedId){
      
      currentCard = <Card key={"card"+index} 
              value={card.pronoun} 
              status={card.status}
              isMatchCheck={true}
              checkMatch={matchCheck}
              />
    }

    if ((index+1) % 12 === 0) {
      board_cards.push( <Col key={'c'+(index+1)} sm={1} className="p-0 d-flex justify-content-center nopadding">
                    {currentCard}
                  </Col>)
      board.push(<Row lg={12} key={'r'+board.length+1} className="g-1 justify-content-center nopadding">{[...board_cards]}</Row>);
      board_cards = [];
    } else if (index === pronouns.length-1) {
      board_cards.push( <Col key={'c'+(index+1)} sm={1} className="p-0 d-flex justify-content-center nopadding">
                    {currentCard}
                  </Col>)
      board.push(<Row lg={12} key={'r'+board.length+1} className="g-1 justify-content-center nopadding" >{[...board_cards]}</Row>);
      board_cards = [];
    } else {
      board_cards.push( <Col key={'c'+(index+1)} sm={1} className="p-0 d-flex justify-content-center nopadding">
                    {currentCard}
                  </Col>)
    }
  });
  
  return (
    <React.Fragment>
      <ScoreBoard score={score} togglePlayer={togglePlayer} playerNames={playerNames}/>
      {board}
    </React.Fragment>
  );
}

function App() {
  const [flippedCards, setFlippedCards] = useState([]);
  const [cards, setCards] = useState(loadPronouns);
  const [score, setScore] = useState([{"score":0}, {"score":0}]);
  const [togglePlayer, setTogglePlayer] = useState(false);
  const [players, setPlayers] = useState([]);
  const isPlayerNameSet = players.length === 2;

  function loadPronouns() {
    const initCards = [];
    pronouns.forEach((pronoun,index)=>{
      initCards.push({ 'id': index, 'pronoun':"", 'status': 0 });   
    });

    return initCards;
  }

  function handlePlay(nextCards, nextFlippedCards, points, switchPlayer, showPronoun){
    setFlippedCards(nextFlippedCards);
    setCards(nextCards);
    setScore(points);
    setTogglePlayer(switchPlayer);
  }

  function initGame(playerNames) {
    setPlayers(playerNames);
  }

  let game;
  console.log("# of players: "+players.length);
  if(!isPlayerNameSet) {
    game = <React.Fragment>      
            <header>
                <img src={process.env.PUBLIC_URL + '/mustache-logo.png'} alt="Mustache"/>
                <br/>
                <code>Mustache Game - Pronouns</code>
            </header><GameInit players={players} initGame={initGame}/>
          </React.Fragment>;
  } else {
    game = <React.Fragment>      
              <header>
                  <code>Mustache Game - Pronouns</code>
              </header><Board cards={cards} onPlay={handlePlay} flippedCards={flippedCards} score={score} togglePlayer={togglePlayer} playerNames={players}/>
            </React.Fragment>;
    
  }
  return (
    <Container fluid="lg" className="App">
      {game}
    </Container>
  );
  
}

function checkForMatches(flippedCards) {
  if(flippedCards.length < 2) {
    return false;
  }
  let cardOne = flippedCards[0];
  let cardTwo = flippedCards[1];
  console.log(pronouns_json[cardOne.pronoun]+":"+pronouns_json[cardTwo.pronoun]);
  //console.log("My Guess is:"+myGuess);
  if (pronouns_json[cardOne.pronoun] === pronouns_json[cardTwo.pronoun]) {
    //console.log("THEY MATCH!");
    return true
  } else {
     return false;
  }
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export default App;

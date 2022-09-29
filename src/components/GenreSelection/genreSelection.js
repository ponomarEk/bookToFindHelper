import React, { useEffect, useState } from "react";
import useLoadedData from "../../utils/index";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@mui/material/Button";
import axios from "axios";

const shortid = require('shortid');

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 250,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageContainer: {
    width: 500,
    height: 650,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
  image: {
    width: "100%",
    height: "100%",
  },
}));

const GenreSelection = () => {
  const classes = useStyles();
  const [genres, setGenres] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [bookToFindData, setBookToFindData] = useState(null);
  const { data, loadData } = useLoadedData({
    loadURL:
      "https://dry-thicket-15078.herokuapp.com/https://www.goodreads.com/choiceawards/best-books-2021?key=xQXvrwOTLq7xonOLcjt2A",
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const genreXPathRes = data?.evaluate(
      "//h4[@class='category__copy']",
      data,
      null,
      XPathResult.ANY_TYPE
    );
    const nodes = [];
    let node = genreXPathRes?.iterateNext();
    while (node) {
      nodes.push(node);
      node = genreXPathRes?.iterateNext();
    }
    setGenres(nodes);
  }, [data]);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    const imageXPathRes = data?.evaluate(
      `//div[contains(@class, 'category clearFix') and ./a[contains(.,"${e.target.value}")]]//div/img`,
      data,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    );
    const src = imageXPathRes.singleNodeValue.getAttribute("src");
    const alt = imageXPathRes.singleNodeValue.getAttribute("alt");
    setBookToFindData({
      src,
      nameOfBook: alt,
    });
  };

  const handleButtonClick = () => {
    //  NOTEinstead of "add to cart" i will use "add to list" 
    axios.get('http://localhost:5000/add-to-list', { params: { nameOfBook: bookToFindData.nameOfBook } }); 
  };

  return (
    <div className={classes.container}>
      <h2>Please, select preffered genre of book</h2>
      <FormControl className={classes.formControl}>
        <InputLabel id="controlled-select-label">Genres</InputLabel>
        <Select
          labelId="controlled-select-label"
          id="controlled-select"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          {genres?.map((option) => {
            const name = option.innerHTML.replace(/&amp;/g, "&");
            return <MenuItem key={shortid.generate()} value={name}>{name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      {bookToFindData && (
        <>
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              src={bookToFindData.src}
              alt={bookToFindData.nameOfBook}
            />
          </div>
          <Button variant="contained" onClick={handleButtonClick}>
            Show book on Amazon
          </Button>
        </>
      )}
    </div>
  );
};

export default GenreSelection;

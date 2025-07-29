import { connect } from "react-redux";
import About from "./About";
import { changeSearchNumberThunkCreator, setSearchCelebretyInput, toggleActivePoint } from "../../redux/reducers/celebreties-reducer";
import { getArticlesThunkCreator } from "../../redux/reducers/articles-reduser";

const mapStateToProps = (state) => {
    return{
        celebreties: state.celebreties.celebreties,
        searchCelebretyInput: state.celebreties.searchCelebretyInput,
        searchCelebretyList: state.celebreties.searchCelebretyList,
        articles: state.articles.articles,
        sortedAddresses: state.celebreties.sortedAddresses,
        sortedSearched: state.celebreties.sortedSearched
    }
}

export default connect(mapStateToProps, {
    setSearchCelebretyInput, getArticlesThunkCreator, changeSearchNumberThunkCreator
})(About);
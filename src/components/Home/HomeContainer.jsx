import { connect } from "react-redux";
import Home from "./Home";
import { changeSearchNumberThunkCreator, setSearchCelebretyInput, toggleActivePoint } from "../../redux/reducers/celebreties-reducer";

const mapStateToProps = (state) => {
    return{
        celebreties: state.celebreties.celebreties,
        points: state.celebreties.points,
        searchCelebretyInput: state.celebreties.searchCelebretyInput,
        searchCelebretyList: state.celebreties.searchCelebretyList
    }
}

export default connect(mapStateToProps, {
    setSearchCelebretyInput, toggleActivePoint, changeSearchNumberThunkCreator
})(Home);
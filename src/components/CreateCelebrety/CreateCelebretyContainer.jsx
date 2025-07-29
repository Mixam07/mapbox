import { connect } from "react-redux";
import CreateCelebrety from "./CreateCelebrety";
import { createCelebretyThunkCreator, getCelebretiesThunkCreator } from "../../redux/reducers/celebreties-reducer";

const mapStateToProps = (state) => {
    return{
        celebretiesNumber: state.celebreties.celebretiesNumber,
        filterList: state.celebreties.filterList
    }
}

export default connect(mapStateToProps, {
    createCelebretyThunkCreator, getCelebretiesThunkCreator
})(CreateCelebrety);
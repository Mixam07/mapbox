import { connect } from "react-redux";
import { addAddressThunkCreator, getCelebretiesThunkCreator } from "../../redux/reducers/celebreties-reducer";
import Report from "./Report";

const mapStateToProps = (state) => {
    return{
    }
}

export default connect(mapStateToProps, {
    addAddressThunkCreator, getCelebretiesThunkCreator
})(Report);
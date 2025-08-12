import { useNavigate } from 'react-router';

function NavigatorHOC(Component) {    
    return function WrappedComponent(props) {
        const navigate = useNavigate();

        return(
            <Component {...props} navigate={navigate} />
        )
    }
}

export default NavigatorHOC;
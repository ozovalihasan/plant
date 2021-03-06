import PropTypes from 'prop-types';
import emptyImageSVG from '../assets/emptyImage.svg';

const EmptyImage = ({ className = '' }) => (
  <img src={emptyImageSVG} alt="Not provided" className={className} />
);

EmptyImage.propTypes = {
  className: PropTypes.string.isRequired,
};

export default EmptyImage;

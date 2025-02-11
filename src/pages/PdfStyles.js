// PdfStyles.js
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  titleContainer: {
    marginBottom: 10,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  theader: {
    flex: 1,
    border: '1px solid #000',
    padding: 4,
    textAlign: 'center',
    fontSize: 10,
  },
  tbody: {
    flex: 1,
    border: '1px solid #000',
    padding: 4,
    textAlign: 'center',
    fontSize: 10,
  },
});

export default styles;

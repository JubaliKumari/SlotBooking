import Toast from 'react-native-root-toast';
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const notify = (message, type = "success") => {
  let backgroundColor = "#333";
  
  if (type === 'warning') backgroundColor = "#f39c12";
  if (type === 'danger') backgroundColor = "#e74c3c";
  if (type === 'success') backgroundColor = "#2ecc71";

  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: false,
    animation: true,
    hideOnPress: true,
    backgroundColor: backgroundColor,
    textColor: "#ffffff",
    opacity: 1,
    // --- Seamless Full Width Logic ---
    containerStyle: {
      width: width,             // Use full device width
      marginHorizontal: 0,      // Forces 0 margin on Left and Right
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? 25 : 15, // Extra padding for iOS status bar
      justifyContent: 'center',
      borderRadius: 0,          // Sharp corners for the "bar" look
      top: 0,                   // Ensures it sticks to the very top
    },
    textStyle: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      width: '80%',            // Ensures text centers within the full-width container
    },
  });
};
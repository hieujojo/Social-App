import { View } from 'react-native';
import ProfileIndex from '../components/profile/ProfileIndex';
import ProfileEdit from '../components/profile/ProfileEdit';
import ProfileFollowers from '../components/profile/ProfileFollowers';

// Giả sử bạn đã có Stack từ _layout.tsx toàn cục
const Profile = () => {
  return (
    <View>
      {/* Render component profile chính */}
      <ProfileIndex />
      {/* Các component con sẽ được điều hướng qua stack trong _layout.tsx */}
    </View>
  );
};

export default Profile;
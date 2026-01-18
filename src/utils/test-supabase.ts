import { supabase } from '@/lib/supabase';

/**
 * Test kết nối Supabase
 * Gọi function này để kiểm tra xem đã kết nối thành công chưa
 */
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Đang kiểm tra kết nối Supabase...');
    
    // Kiểm tra config
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY trong .env.local');
      return false;
    }
    
    console.log('✅ Environment variables OK');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...');
    
    // Test query đơn giản - lấy thông tin về database
    const { data, error } = await supabase
      .from('_test_')
      .select('*')
      .limit(1);
    
    // Nếu table không tồn tại, sẽ có error nhưng connection vẫn OK
    if (error) {
      // Check nếu error là do table không tồn tại (connection OK)
      if (
        error.message.includes('does not exist') || 
        error.message.includes('Could not find the table') ||
        error.message.includes('schema cache') ||
        error.code === '42P01' ||
        error.code === 'PGRST204'
      ) {
        console.log('✅ Kết nối Supabase THÀNH CÔNG!');
        console.log('ℹ️  Table "_test_" chưa tồn tại (bình thường)');
        console.log('💡 Connection đến database hoạt động OK!');
        return true;
      }
      
      // Error khác (connection failed)
      console.error('❌ Lỗi kết nối Supabase:', error.message);
      console.error('📋 Error code:', error.code);
      return false;
    }
    
    console.log('✅ Kết nối Supabase THÀNH CÔNG!');
    console.log('📊 Data:', data);
    return true;
    
  } catch (err) {
    console.error('❌ Exception khi test Supabase:', err);
    return false;
  }
}

/**
 * Test authentication service
 */
export async function testSupabaseAuth() {
  try {
    console.log('🔍 Đang kiểm tra Supabase Auth...');
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Lỗi Auth:', error.message);
      return false;
    }
    
    console.log('✅ Supabase Auth OK');
    console.log('👤 Session:', data.session ? 'Đã đăng nhập' : 'Chưa đăng nhập');
    return true;
    
  } catch (err) {
    console.error('❌ Exception khi test Auth:', err);
    return false;
  }
}

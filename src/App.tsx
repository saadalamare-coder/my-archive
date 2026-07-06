import { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import {
  Folder,
  Video,
  Users,
  Clock,
  Shield,
  Music,
  ArrowLeft,
  Upload,
  Play,
  Pause,
  Camera,
  MapPin,
  Calendar,
  Tag,
  EyeOff,
  Volume2,
  VolumeX,
  Wand2,
  Home,
} from 'lucide-react';

// Types
interface Media {
  id: string;
  folder_id: string;
  type: 'photo' | 'video';
  title: string;
  file_url: string;
  thumbnail_url: string;
  year: number;
  date: string;
  location: string;
  story: string;
  enhanced_url: string;
  created_at: string;
}

interface FolderType {
  id: string;
  name: string;
  description: string;
  background_image_url: string;
  background_blur: number;
  created_at: string;
}

interface Person {
  id: string;
  name: string;
  profile_image_url: string;
}

// Audio tracks
const audioTracks = [
  {
    id: 'heritage',
    name: 'ألحان تراثية إماراتية',
    composer: 'عزف تقليدي من الثمانينات',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'mohammad-abdu',
    name: 'ألحان محمد عبده الكلاسيكية',
    composer: 'عزف موسيقي نقي',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
];

// Demo data
const demoFolders: FolderType[] = [
  { id: '1', name: 'ذكريات العائلة', description: 'صور وفيديوهات عائلية عبر السنين', background_image_url: 'https://images.pexels.com/photos/1128978/pexels-photo-1128978.jpeg?auto=compress&cs=tinysrgb&w=1920', background_blur: 20, created_at: '2024-01-01' },
  { id: '2', name: 'مناسبات خاصة', description: 'أعراس، احتفالات، ومواسم', background_image_url: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1920', background_blur: 25, created_at: '2024-01-01' },
  { id: '3', name: 'السفر والرحلات', description: 'مغامراتنا في أرجاء العالم', background_image_url: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1920', background_blur: 20, created_at: '2024-01-01' },
  { id: '4', name: 'أيام الطفولة', description: 'لحظات بريئة من الماضي', background_image_url: 'https://images.pexels.com/photos/1287378/pexels-photo-1287378.jpeg?auto=compress&cs=tinysrgb&w=1920', background_blur: 15, created_at: '2024-01-01' },
  { id: '5', name: 'الأصدقاء والصحاب', description: 'ذكريات مع من نحب', background_image_url: 'https://images.pexels.com/photos/1855216/pexels-photo-1855216.jpeg?auto=compress&cs=tinysrgb&w=1920', background_blur: 22, created_at: '2024-01-01' },
];

const demoMedia: Media[] = [
  { id: '1', folder_id: '1', type: 'photo', title: 'عيد الأضحى ١٩٨٥', file_url: 'https://images.pexels.com/photos/2781167/pexels-photo-2781167.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/2781167/pexels-photo-2781167.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1985, date: '1985-08-28', location: 'الإمارات، أبوظبي', story: 'صورة تجمع العائلة يوم عيد الأضحى المبارك، الأب والأم محاطين بأبنائهم في لحظة سعادة غامرة. كنا نرتدي أجمل ملابسنا العيدية ونبدأ اليوم بصلاة العيد ثم زيارة الأقارب.', enhanced_url: '', created_at: '1985-08-28' },
  { id: '2', folder_id: '1', type: 'photo', title: 'العشاء العائلي', file_url: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1988, date: '1988-07-15', location: 'الإمارات، دبي', story: 'العشاء الشهري الذي كان يجمعنا كل أول الشهر، كنا نتناول الأكلات التراثية ونستمع لحكايات الجد عن الماضي وقصص الغوص والسفر.', enhanced_url: '', created_at: '1988-07-15' },
  { id: '3', folder_id: '1', type: 'video', title: 'حفل التخرج', file_url: 'https://images.pexels.com/photos/2833631/pexels-photo-2833631.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/2833631/pexels-photo-2833631.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1992, date: '1992-06-20', location: 'الإمارات، الشارقة', story: 'يوم تخرج الإبن الأكبر من الجامعة، لحظة فخر للعائلة بأكملها. فرحة لا تُنسى وسُرور غامر.', enhanced_url: '', created_at: '1992-06-20' },
  { id: '4', folder_id: '2', type: 'photo', title: 'زفاف الأخت الكبرى', file_url: 'https://images.pexels.com/photos/301663/pexels-photo-301663.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/301663/pexels-photo-301663.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1987, date: '1987-03-15', location: 'الإمارات، العين', story: 'ليلة الزفاف الكبرى، كانت تعادل الليالي من الجمال والفرح. ليلة عمر لا تُنسى ملؤها الأهازيج وألوان الفرح.', enhanced_url: '', created_at: '1987-03-15' },
  { id: '5', folder_id: '3', type: 'photo', title: 'رحلة إلى مصر', file_url: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1990, date: '1990-09-10', location: 'مصر، القاهرة', story: 'زيارة الأهرامات والتاريخ العريق، كانت رحلة حياة قلبية استمتعنا فيها بجميع تفاصيل الحضارة الفرعونية.', enhanced_url: '', created_at: '1990-09-10' },
  { id: '6', folder_id: '3', type: 'photo', title: 'على شاطئ البحر', file_url: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1978, date: '1978-07-20', location: 'الإمارات، دبي', story: 'أيام الشباب على شاطئ الخور، قبل أن تصل الأسواق الحديثة. البحر كان مصدر الرزق والسراب.', enhanced_url: '', created_at: '1978-07-20' },
  { id: '7', folder_id: '4', type: 'photo', title: 'في فناء البيت', file_url: 'https://images.pexels.com/photos/2962897/pexels-photo-2962897.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/2962897/pexels-photo-2962897.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1975, date: '1975-12-05', location: 'الإمارات، أبوظبي', story: 'لعب الأطفال في فناء البيت التراثي، أيام كانت فيها الحياة بسيطة واللعب يعتمد على الخيال والإبداع.', enhanced_url: '', created_at: '1975-12-05' },
  { id: '8', folder_id: '4', type: 'video', title: 'تعلم السباحة', file_url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1982, date: '1982-08-01', location: 'الإمارات، أم القيوين', story: 'الأب يعلم أبناءه السباحة في البحر، تمرير للمهارات الحياتية والترابط العائلي من جيل لجيل.', enhanced_url: '', created_at: '1982-08-01' },
  { id: '9', folder_id: '5', type: 'photo', title: 'مجلس الأصدقاء', file_url: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=1280', thumbnail_url: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=400', year: 1989, date: '1989-11-20', location: 'الإمارات، رأس الخيمة', story: 'ليلة جمعت الأصدقاء في مجلس الديوان، شاي وكلام وسمر حتى الفجر. أيام كانت الصداقة تُعول.', enhanced_url: '', created_at: '1989-11-20' },
];

const demoPeople: Person[] = [
  { id: '1', name: 'محمد', profile_image_url: '' },
  { id: '2', name: 'عائشة', profile_image_url: '' },
  { id: '3', name: 'أحمد', profile_image_url: '' },
  { id: '4', name: 'فاطمة', profile_image_url: '' },
  { id: '5', name: 'عبدالله', profile_image_url: '' },
];

type View = 'otp' | 'home' | 'folder' | 'media' | 'people' | 'upload' | 'enhance';

export default function App() {
  const [view, setView] = useState<View>('otp');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitorCode, setVisitorCode] = useState('');
  const [folders, setFolders] = useState<FolderType[]>(demoFolders);
  const [media, setMedia] = useState<Media[]>([]);
  const [people] = useState<Person[]>(demoPeople);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [dynamicBg, setDynamicBg] = useState<string>('');
  const [showBlurProtection, setShowBlurProtection] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [enhancerSlider, setEnhancerSlider] = useState(50);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [timelineDecade, setTimelineDecade] = useState<number | null>(null);
  const [otpError, setOtpError] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const otpInputRef = useRef<HTMLInputElement[]>([]);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [uploadData, setUploadData] = useState({
    title: '',
    year: new Date().getFullYear(),
    location: '',
    story: '',
    file: null as File | null,
  });

  // Check for window focus for blur protection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setShowBlurProtection(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Prevent right-click
  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventRightClick);
    return () => document.removeEventListener('contextmenu', preventRightClick);
  }, []);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    setAudioElement(audio);
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle audio track change
  useEffect(() => {
    if (audioElement && isAudioPlaying) {
      audioElement.src = audioTracks[currentAudioTrack].url;
      audioElement.play().catch(() => {});
    }
  }, [currentAudioTrack, audioElement, isAudioPlaying]);

  // OTP verification
  const handleOTPSubmit = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('يرجى إدخال الرمز كاملاً');
      return;
    }
    setLoading(true);
    setOtpError('');

    // Demo codes that always work
    if (code === '123456' || code === '654321') {
      setVisitorCode(code);
      setIsAuthenticated(true);
      setView('home');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .is('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        await supabase
          .from('otp_codes')
          .update({ is_used: true, used_at: new Date().toISOString(), is_active: false })
          .eq('id', data.id);

        setVisitorCode(code);
        setIsAuthenticated(true);
        setView('home');
      } else {
        setOtpError('الرمز غير صالح أو منتهي الصلاحية');
      }
    } catch {
      setOtpError('الرمز غير صالح');
    } finally {
      setLoading(false);
    }
  };

  // Fetch folders
  const fetchFolders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('folders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setFolders(data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch media by folder
  const fetchMedia = async (folderId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setMedia(data);
      } else {
        setMedia(demoMedia.filter(m => m.folder_id === folderId));
      }
    } catch {
      setMedia(demoMedia.filter(m => m.folder_id === folderId));
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: FolderType) => {
    setSelectedFolder(folder);
    setDynamicBg(folder.background_image_url);
    fetchMedia(folder.id);
    setView('folder');
  };

  const handleMediaClick = (item: Media) => {
    setSelectedMedia(item);
    setView('media');
  };

  const handleBack = () => {
    switch (view) {
      case 'folder':
        setSelectedFolder(null);
        setMedia([]);
        setDynamicBg('');
        setView('home');
        break;
      case 'media':
        setSelectedMedia(null);
        setView('folder');
        break;
      case 'people':
      case 'upload':
      case 'enhance':
        setView('home');
        break;
      default:
        break;
    }
  };

  const toggleAudio = () => {
    if (!audioElement) return;
    if (isAudioPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(() => {});
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const switchAudioTrack = (index: number) => {
    setCurrentAudioTrack(index);
  };

  const toggleMute = () => {
    if (audioElement) {
      audioElement.volume = isAudioMuted ? 0.5 : 0;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // OTP digit input handler
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only accept single digit
    const digit = value.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    // Create new array with updated digit
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputRef.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    const allFilled = newDigits.every(d => d !== '');
    if (allFilled) {
      const code = newDigits.join('');
      // Check demo codes immediately
      if (code === '123456' || code === '654321') {
        setVisitorCode(code);
        setIsAuthenticated(true);
        setView('home');
      }
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.title || !selectedFolder) return;
    setLoading(true);

    try {
      const fileName = `${Date.now()}_${uploadData.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, uploadData.file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);

      await supabase.from('media').insert({
        folder_id: selectedFolder.id,
        type: uploadType,
        title: uploadData.title,
        file_url: urlData.publicUrl,
        thumbnail_url: urlData.publicUrl,
        year: uploadData.year,
        location: uploadData.location,
        story: uploadData.story,
      });

      fetchMedia(selectedFolder.id);
      setUploadData({ title: '', year: new Date().getFullYear(), location: '', story: '', file: null });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique decades for timeline
  const decades = [...new Set(demoMedia.map(m => Math.floor(m.year / 10) * 10))].sort();

  // Filter media by decade
  const filteredMedia = timelineDecade
    ? media.filter(m => Math.floor(m.year / 10) * 10 === timelineDecade)
    : media;

  // Fetch initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchFolders();
    }
  }, [isAuthenticated]);

  // OTP Login Screen
  if (view === 'otp' || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1920)',
              filter: 'blur(30px) brightness(0.3)',
              transform: 'scale(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1e]/95 via-[#1a1a1e]/90 to-[#1a1a1e]/95" />
        </div>

        <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 animate-slide-up z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#c9a227] to-[#e8c547] flex items-center justify-center">
              <Shield className="w-10 h-10 text-[#1a1a1e]" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
              أرشيف الذكريات
            </h1>
            <p className="text-[#a1a1aa] text-sm">أدخل الرمز السري للدخول بنظام الدخول المحدود</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { if (el) otpInputRef.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      otpInputRef.current[index - 1]?.focus();
                    }
                    if (e.key === 'Enter') {
                      handleOTPSubmit();
                    }
                  }}
                  className="w-12 h-14 text-center text-2xl font-semibold bg-[#2d2d35] border-2 border-[#363640] rounded-xl text-[#f5f5f7] focus:border-[#c9a227] focus:outline-none focus:shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-red-500 text-sm text-center">{otpError}</p>
            )}

            <button
              onClick={handleOTPSubmit}
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-br from-[#c9a227] to-[#e8c547] text-[#1a1a1e] font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(201,162,39,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">جاري التحقق...</span>
              ) : (
                <>
                  <Shield size={18} />
                  <span>دخول</span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-[#52525b] mt-4">
              للتجربة: استخدم الرمز 123456
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen relative" dir="rtl">
      {/* Dynamic Background */}
      {dynamicBg && (
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${dynamicBg})`,
              filter: `blur(${selectedFolder?.background_blur || 30}px) brightness(0.25)`,
              transform: 'scale(1.15)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1e]/80 via-[#1a1a1e]/70 to-[#1a1a1e]/90" />
        </div>
      )}

      {/* Blur Protection Overlay */}
      <div className={`fixed inset-0 bg-[#1a1a1e] z-[10000] flex items-center justify-center transition-opacity duration-300 ${showBlurProtection ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-center">
          <EyeOff className="w-16 h-16 mx-auto mb-4 text-[#c9a227]" />
          <h2 className="text-2xl font-bold mb-2">الشاشة مؤمنة</h2>
          <p className="text-[#a1a1aa]">عُد إلى هذه النافذة لمتابعة المشاهدة</p>
        </div>
      </div>

      {/* Floating Watermark */}
      {isAuthenticated && (
        <div className="fixed text-xs font-semibold tracking-widest text-white/15 z-[9999] pointer-events-none animate-[watermark-move_8s_ease-in-out_infinite]" style={{ top: '20%', left: '15%', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
          CODE: {visitorCode.slice(0, 3)}-{visitorCode.slice(3)}
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(50,50,58,0.7)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view !== 'home' && (
              <button onClick={handleBack} className="p-2 hover:bg-[#363640] rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#e8c547] flex items-center justify-center">
                <Camera className="w-5 h-5 text-[#1a1a1e]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                  أرشيف الذكريات
                </h1>
                <p className="text-xs text-[#71717a]">Cinematic Nostalgia Archive</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('home')}
              className={`p-2 rounded-lg transition-colors ${view === 'home' ? 'bg-[#c9a227]/20 text-[#c9a227]' : 'hover:bg-[#363640]'}`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('people')}
              className={`p-2 rounded-lg transition-colors ${view === 'people' ? 'bg-[#c9a227]/20 text-[#c9a227]' : 'hover:bg-[#363640]'}`}
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('upload')}
              className="p-2 rounded-lg hover:bg-[#363640] transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        {view === 'folder' && media.length > 0 && (
          <div className="px-4 py-2 border-t border-white/10">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-6">
              <Clock className="w-4 h-4 text-[#c9a227]" />
              <div className="flex gap-3">
                <button
                  onClick={() => setTimelineDecade(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${timelineDecade === null ? 'bg-[#c9a227] text-[#1a1a1e]' : 'bg-[#2d2d35] text-[#a1a1aa] hover:bg-[#363640]'}`}
                >
                  الكل
                </button>
                {decades.map((decade) => (
                  <button
                    key={decade}
                    onClick={() => setTimelineDecade(decade)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${timelineDecade === decade ? 'bg-[#c9a227] text-[#1a1a1e]' : 'bg-[#2d2d35] text-[#a1a1aa] hover:bg-[#363640]'}`}
                  >
                    {decade}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Audio Player */}
      {isAuthenticated && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className="bg-[rgba(38,38,45,0.85)] backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#c9a227]" />
              <span className="text-sm font-medium max-w-[150px] truncate">
                {audioTracks[currentAudioTrack].name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAudioPlaying && (
                <div className="flex items-center gap-0.5 h-5">
                  <span className="w-0.5 bg-[#c9a227] rounded animate-[wave_1s_ease-in-out_infinite]" style={{ height: '5px' }} />
                  <span className="w-0.5 bg-[#c9a227] rounded animate-[wave_1s_ease-in-out_infinite_0.1s]" style={{ height: '15px' }} />
                  <span className="w-0.5 bg-[#c9a227] rounded animate-[wave_1s_ease-in-out_infinite_0.2s]" style={{ height: '10px' }} />
                  <span className="w-0.5 bg-[#c9a227] rounded animate-[wave_1s_ease-in-out_infinite_0.3s]" style={{ height: '18px' }} />
                  <span className="w-0.5 bg-[#c9a227] rounded animate-[wave_1s_ease-in-out_infinite_0.15s]" style={{ height: '8px' }} />
                </div>
              )}

              <button onClick={toggleAudio} className="p-2 rounded-full bg-[#c9a227] text-[#1a1a1e] hover:bg-[#e8c547] transition-colors">
                {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => switchAudioTrack(currentAudioTrack === 0 ? 1 : 0)}
                className="p-2 hover:bg-[#363640] rounded-full transition-colors"
                title="تبديل المسار"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.573a.5.5 0 01-.428.67H4v2h7.863a2.5 2.5 0 002.142-1.787l1.095-4.37a.5.5 0 01.428-.67H20V6h-7.863a2.5 2.5 0 00-2.142 1.787l-1.095 4.37z" /></svg>
              </button>

              <button onClick={toggleMute} className="p-2 hover:bg-[#363640] rounded-full transition-colors">
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto relative z-10">
        {/* HOME - Folder Grid */}
        {view === 'home' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="aspect-[4/3] relative overflow-hidden rounded-2xl group cursor-pointer"
                >
                  <img
                    src={folder.background_image_url}
                    alt={folder.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-start">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                      {folder.name}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] mb-3">{folder.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[#c9a227]">
                      <Folder className="w-4 h-4" />
                      <span>استعرض المجلد</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FOLDER - Media Grid */}
        {view === 'folder' && selectedFolder && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                {selectedFolder.name}
              </h2>
              <p className="text-[#a1a1aa]">{selectedFolder.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMediaClick(item)}
                  className="aspect-square relative overflow-hidden rounded-xl group cursor-pointer"
                >
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#1a1a1e]/80 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-7 h-7 text-[#c9a227] ml-1" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                      <Calendar className="w-3 h-3" />
                      <span>{item.year}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MEDIA - Photo Inspector */}
        {view === 'media' && selectedMedia && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Main Media Display */}
              <div className="lg:col-span-2">
                <div className="bg-[rgba(38,38,45,0.85)] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  {selectedMedia.type === 'photo' ? (
                    <img
                      src={selectedMedia.file_url}
                      alt={selectedMedia.title}
                      className="w-full max-h-[70vh] object-contain bg-black"
                    />
                  ) : (
                    <div className="relative bg-black aspect-video">
                      <img
                        src={selectedMedia.thumbnail_url}
                        alt={selectedMedia.title}
                        className="w-full h-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#1a1a1e]/80 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-10 h-10 text-[#c9a227] ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedMedia.type === 'photo' && (
                  <button
                    onClick={() => setView('enhance')}
                    className="mt-4 w-full py-3 px-6 bg-[#2d2d35] border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:border-[#c9a227] transition-colors"
                  >
                    <Wand2 className="w-5 h-5" />
                    <span>تحسين جودة الصورة (HD)</span>
                  </button>
                )}
              </div>

              {/* Inspector Panel */}
              <div className="bg-[rgba(38,38,45,0.85)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-fit">
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                  تفاصيل الصورة
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#c9a227] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#71717a] mb-1">التاريخ</p>
                      <p className="font-medium">{selectedMedia.date || selectedMedia.year}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#c9a227] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#71717a] mb-1">المكان</p>
                      <p className="font-medium">{selectedMedia.location || 'غير معروف'}</p>
                    </div>
                  </div>
                </div>

                <hr className="border-white/10 my-6" />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-[#c9a227]" />
                    <p className="text-sm font-medium">قصة الذكرى</p>
                  </div>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                    {selectedMedia.story}
                  </p>
                </div>

                <hr className="border-white/10 my-6" />

                {/* People Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[#c9a227]" />
                    <p className="text-sm font-medium">الأشخاص</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {people.slice(0, 3).map((person) => (
                      <button
                        key={person.id}
                        onClick={() => setView('people')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#363640] border border-white/10 rounded-full text-xs text-[#a1a1aa] hover:bg-[#c9a227] hover:text-[#1a1a1e] transition-all"
                      >
                        <Tag className="w-3 h-3" />
                        {person.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PEOPLE - People Directory */}
        {view === 'people' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                دليل الأشخاص
              </h2>
              <p className="text-[#a1a1aa]">انقر على الإسم لرؤية جميع صوره</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {people.map((person) => (
                <button
                  key={person.id}
                  className="bg-[rgba(38,38,45,0.85)] backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:border-[#c9a227] transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#2d2d35] to-[#363640] flex items-center justify-center border-2 border-[#c9a227]/30">
                    <Users className="w-8 h-8 text-[#a1a1aa]" />
                  </div>
                  <p className="font-medium mb-1">{person.name}</p>
                  <p className="text-xs text-[#71717a]">{Math.floor(Math.random() * 10) + 1} صور</p>
                </button>
              ))}
            </div>

            {/* Sample person's photos */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c9a227]" />
                صور: محمد
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {demoMedia.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMediaClick(item)}
                    className="aspect-square relative overflow-hidden rounded-xl group cursor-pointer"
                  >
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      <p className="text-sm">{item.title}</p>
                      <p className="text-xs text-[#71717a]">{item.year}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ENHANCE - Image Enhancement */}
        {view === 'enhance' && selectedMedia && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                تحسين جودة الصورة
              </h2>
              <p className="text-[#a1a1aa]">استخدم الخط لمقارنة الصورة الأصلية والمحسنة</p>
            </div>

            <div className="bg-[rgba(38,38,45,0.85)] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              {/* Comparison Slider */}
              <div className="relative aspect-video max-h-[60vh] overflow-hidden rounded-xl select-none">
                {/* Enhanced version (full background) */}
                <img
                  src={selectedMedia.file_url}
                  alt="Enhanced"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'contrast(1.1) brightness(1.05) saturate(1.2)',
                  }}
                />
                {/* Original version (clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - enhancerSlider}% 0 0)` }}
                >
                  <img
                    src={selectedMedia.file_url}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#c9a227] z-10"
                  style={{ left: `${enhancerSlider}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1a1e] border-2 border-[#c9a227] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancerSlider}
                  onChange={(e) => setEnhancerSlider(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
              </div>

              <div className="flex justify-between mt-4 text-sm text-[#71717a]">
                <span>الأصلية</span>
                <span>مُحسنة (HD)</span>
              </div>

              {/* Enhancement Options */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[rgba(50,50,58,0.7)] backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-sm font-medium">وضوح</span>
                  </div>
                  <p className="text-xs text-[#71717a]">تحسين وضوح التفاصيل الدقيقة</p>
                </div>
                <div className="bg-[rgba(50,50,58,0.7)] backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="w-4 h-4 text-[#c9a227]" />
                    <span className="text-sm font-medium">حدة</span>
                  </div>
                  <p className="text-xs text-[#71717a]">زيادة حدة الأطراف والنقاط</p>
                </div>
                <div className="bg-[rgba(50,50,58,0.7)] backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-[#c9a227]" />
                    <span className="text-sm font-medium">تقليل الضجيج</span>
                  </div>
                  <p className="text-xs text-[#71717a]">إزالة التشويش من الصورة</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-[#52525b] mb-4">
                  * هذه التحسينات تحافظ على أصالة الصورة وملامح الأشخاص دون أي تغيير
                </p>
                <button
                  onClick={() => {
                    setIsEnhancing(true);
                    setTimeout(() => setIsEnhancing(false), 2000);
                  }}
                  disabled={isEnhancing}
                  className="py-3 px-8 bg-gradient-to-br from-[#c9a227] to-[#e8c547] text-[#1a1a1e] font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(201,162,39,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isEnhancing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">جاري التحسين...</span>
                    </span>
                  ) : (
                    <span>تحسين الصورة</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {view === 'upload' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                رفع ملف جديد
              </h2>
              <p className="text-[#a1a1aa]">أضف صوراً أو فيديوهات جديدة للأرشيف</p>
            </div>

            <div className="bg-[rgba(38,38,45,0.85)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الملف</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setUploadType('photo')}
                      className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${uploadType === 'photo' ? 'bg-[#c9a227]/20 border-[#c9a227]' : 'bg-[#2d2d35] border-[#363640]'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span>صورة</span>
                    </button>
                    <button
                      onClick={() => setUploadType('video')}
                      className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${uploadType === 'video' ? 'bg-[#c9a227]/20 border-[#c9a227]' : 'bg-[#2d2d35] border-[#363640]'}`}
                    >
                      <Video className="w-5 h-5" />
                      <span>فيديو</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">العنوان</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full bg-[#2d2d35] border border-[#363640] rounded-xl px-4 py-3 focus:border-[#c9a227] outline-none transition-colors"
                    placeholder="عنوان الملف"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">السنة</label>
                  <input
                    type="number"
                    value={uploadData.year}
                    onChange={(e) => setUploadData({ ...uploadData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full bg-[#2d2d35] border border-[#363640] rounded-xl px-4 py-3 focus:border-[#c9a227] outline-none transition-colors"
                    placeholder="السنة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">المكان</label>
                  <input
                    type="text"
                    value={uploadData.location}
                    onChange={(e) => setUploadData({ ...uploadData, location: e.target.value })}
                    className="w-full bg-[#2d2d35] border border-[#363640] rounded-xl px-4 py-3 focus:border-[#c9a227] outline-none transition-colors"
                    placeholder="مكان التقاط الصورة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">قصة الذكرى</label>
                  <textarea
                    value={uploadData.story}
                    onChange={(e) => setUploadData({ ...uploadData, story: e.target.value })}
                    className="w-full bg-[#2d2d35] border border-[#363640] rounded-xl px-4 py-3 focus:border-[#c9a227] outline-none transition-colors h-32 resize-none"
                    placeholder="اكتب قصة أو تفاصيل عن هذه الذكرى..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الملف</label>
                  <div className="relative border-2 border-dashed border-[#363640] rounded-xl p-8 text-center hover:border-[#c9a227] transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-[#71717a]" />
                    <p className="text-[#a1a1aa]">اسحب الملف هنا أو انقر للاختيار</p>
                    <input
                      type="file"
                      accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                    />
                  </div>
                  {uploadData.file && (
                    <p className="text-sm text-[#71717a] mt-2">{uploadData.file.name}</p>
                  )}
                </div>

                <button
                  onClick={handleUpload}
                  disabled={loading || !uploadData.file}
                  className="w-full py-3 bg-gradient-to-br from-[#c9a227] to-[#e8c547] text-[#1a1a1e] font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(201,162,39,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {loading ? 'جاري الرفع...' : 'رفع الملف'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

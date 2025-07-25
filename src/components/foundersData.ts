import TeamFlipCard from '@/components/TeamFlipCard';

const founders = [
  {
    name: 'إسلام',
    role: 'المؤسس والرئيس التنفيذي',
    image: '/assets/islam.jpg',
    bio: 'مؤسس ورئيس تنفيذي للشركة، يتمتع بخبرة 15 عاماً في مجال الزراعة والتكنولوجيا الزراعية.',
    skills: [
      { icon: '🌱', text: 'خبير في الزراعة المستدامة' },
      { icon: '💡', text: 'مبتكر في التقنيات الزراعية' },
      { icon: '🤝', text: 'قائد في بناء العلاقات' },
    ],
  },
  {
    name: 'المؤسس الثاني',
    role: 'شريك مؤسس، تطوير الأعمال والتسويق الزراعي',
    image: undefined,
    bio: 'شريك مؤسس في الشركة، متخصص في تطوير الأعمال والتسويق الزراعي.',
    skills: [
      { icon: '📈', text: 'خبير في تطوير الأعمال' },
      { icon: '🎯', text: 'متخصص في التسويق الزراعي' },
      { icon: '🌍', text: 'خبرة في الأسواق الدولية' },
    ],
  },
  {
    name: 'المؤسس الثالث',
    role: 'شريك مؤسس، التكنولوجيا والحلول الرقمية',
    image: undefined,
    bio: 'شريك مؤسس في الشركة، متخصص في التكنولوجيا والحلول الرقمية للزراعة.',
    skills: [
      { icon: '💻', text: 'خبير في التكنولوجيا الزراعية' },
      { icon: '🔧', text: 'متخصص في الحلول الرقمية' },
      { icon: '🚀', text: 'مبتكر في الابتكارات التقنية' },
    ],
  },
];

export default founders;

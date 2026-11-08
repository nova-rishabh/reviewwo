/** Industry landing pages. Each entry must carry content specific to that business type. */
export const INDUSTRIES = [
  {
    slug: 'restaurants',
    label: 'Restaurants',
    metaTitle: 'Google Review QR Codes for Restaurants',
    metaDescription:
      'Get more Google reviews for your restaurant with review QR codes on tables and at the billing counter. Hear about slow service or cold food before guests leave.',
    h1: 'More Google reviews for your restaurant',
    lead:
      'Diners decide where to eat by scanning star ratings on Google Maps. A review QR code on every table turns a good meal into a review while the plates are still being cleared.',
    moment:
      'The best moment is when the bill arrives. Guests are relaxed, the meal is fresh in their mind, and they already have their phone out to pay by UPI. Ask the server who looked after the table to mention the QR code as they bring the bill folder.',
    placement: [
      ['On every table', 'Print the QR code on a small table sign next to the condiments, or slip it into the bill folder.'],
      ['At the billing counter', 'For quick-service and takeaway, put the review QR code beside the payment QR so customers see both together.'],
      ['At the pickup window', 'Delivery partners will not use it, but dine-in and takeaway customers waiting for orders often will.'],
    ],
    mentions: ['Tasty food', 'Friendly staff', 'Quick service', 'Good portions', 'Nice ambience', 'Good value'],
    catchEarly: [
      'Long waits between courses on busy evenings',
      'Food arriving cold or not as ordered',
      'Billing mistakes and service charge confusion',
      'Cleanliness of tables and washrooms',
    ],
    script: '“Hope you enjoyed the meal. If you have a minute, scan this QR code to leave us a Google review.”',
    faqs: [
      {
        q: 'How many review QR codes does a restaurant need?',
        a: 'One per table works best, because guests use what is in front of them. If you start smaller, put one at the billing counter and one on each of your busiest tables.',
      },
      {
        q: 'Can we tell which tables get scanned most?',
        a: 'Yes. Name each QR code after its table, such as “Table 4”, and the dashboard shows scans for every QR code.',
      },
      {
        q: 'Will the manager know if a guest complains through the QR code?',
        a: 'Yes. If a guest sends a private message, it is forwarded to the manager’s WhatsApp straight away with the table name, so someone can go over before the guest leaves.',
      },
    ],
  },
  {
    slug: 'cafes',
    label: 'Cafés and bakeries',
    metaTitle: 'Google Review QR Codes for Cafés and Bakeries',
    metaDescription:
      'Google review QR codes for cafés, coffee shops and bakeries. Customers scan at the counter while they wait for their order and leave a review in under a minute.',
    h1: 'Google reviews for cafés and bakeries',
    lead:
      'Cafés live on regulars and on people searching “coffee near me”. A review QR code by the till catches customers in the minute they spend waiting for their order.',
    moment:
      'In a café, the wait for the coffee is the moment. The customer has paid, is standing at the counter and usually has their phone in hand. For sit-down cafés, a QR code on the table works the same way as in a restaurant.',
    placement: [
      ['Next to the payment QR', 'Customers are already holding their phone to pay. Put the review QR code right beside it, clearly labelled.'],
      ['At the pickup counter', 'Where people wait for their drinks.'],
      ['On tables for people who stay', 'Laptop workers and groups who sit for an hour are often happy to leave a review.'],
    ],
    mentions: ['Great coffee', 'Friendly staff', 'Cosy place', 'Quick service', 'Tasty snacks', 'Good value'],
    catchEarly: [
      'Orders called out wrongly or forgotten during rush hour',
      'Wi-Fi or charging points not working',
      'Seating, noise or air conditioning complaints',
      'Pastries sold out early in the day',
    ],
    script: '“Your latte will be two minutes. If you like the place, scan this code to leave us a review.”',
    faqs: [
      {
        q: 'Will customers confuse the review QR code with our UPI payment QR?',
        a: 'Yes. Your review QR code is separate from your payment QR code, so customers won’t mix them up. Label the review code clearly, for example “Scan to review us on Google”, and keep it beside the payment code so customers notice both.',
      },
      {
        q: 'We are a small café with one counter. Which plan should we pick?',
        a: 'Starter includes one QR code, which is enough for a single counter. If you add codes on tables later, Growth covers up to five.',
      },
      {
        q: 'Can customers review us in Hindi or other languages?',
        a: 'Yes. Customers write the review themselves on Google, in whatever language they like.',
      },
    ],
  },
  {
    slug: 'salons',
    label: 'Salons and spas',
    metaTitle: 'Google Review QR Codes for Salons and Spas',
    metaDescription:
      'Help clients review your salon or spa on Google right after their appointment. review QR codes at the mirror and reception, with private feedback to the manager.',
    h1: 'Google reviews for salons and spas',
    lead:
      'People choose a salon by reading reviews about specific stylists and treatments. Asking at the end of the appointment, while the client is happy with the result, makes all the difference.',
    moment:
      'Ask when the client sees the finished result in the mirror, or as they settle the bill at reception. The stylist or therapist who looked after them should make the ask; clients are far more likely to respond to someone they just spent an hour with.',
    placement: [
      ['At each station', 'A small QR sign at the mirror lets the stylist mention it as they finish.'],
      ['At reception', 'Clients scan it while paying or booking their next appointment.'],
      ['In the spa lounge', 'For treatments, a QR sign where clients relax afterwards works better than at the door.'],
    ],
    mentions: ['Great result', 'Friendly staff', 'Clean and hygienic', 'On time', 'Relaxing', 'Good value'],
    catchEarly: [
      'A colour or cut not matching what the client asked for',
      'Appointments running late',
      'Hygiene concerns about tools or towels',
      'Prices at billing different from what was quoted',
    ],
    script: '“Happy with how it turned out? If you have a moment, scan this and tell people on Google. It really helps us.”',
    faqs: [
      {
        q: 'Can clients mention their stylist by name?',
        a: 'Yes. Clients write their own review on Google, and many mention their stylist. Encourage stylists to introduce themselves by name during the appointment.',
      },
      {
        q: 'What if a client is unhappy with their result?',
        a: 'The QR code gives every client the option to message the manager privately, and the message reaches the manager’s WhatsApp straight away, often while the client is still at reception. Clients can still post on Google if they want to.',
      },
      {
        q: 'Should we offer a discount for reviews?',
        a: 'No. Google does not allow incentives for reviews, and reviews obtained that way can be removed. Ask every client instead, and make it quick.',
      },
    ],
  },
  {
    slug: 'clinics',
    label: 'Clinics and doctors',
    metaTitle: 'Google Reviews for Clinics and Doctors',
    metaDescription:
      'A respectful way for patients to review your clinic on Google: QR codes at the billing desk, private feedback for the manager, and patient privacy tips.',
    h1: 'Google reviews for clinics and doctors',
    lead:
      'Patients choosing a clinic read reviews about waiting times, staff and how clearly things were explained. A QR code at the billing desk lets satisfied patients share that, without any pressure in the consulting room.',
    moment:
      'Ask at the billing or pharmacy counter after the consultation, never in the consulting room. Front-desk staff, not the doctor, should mention the QR code, and patients should never feel that care depends on leaving a review.',
    placement: [
      ['At the billing desk', 'The natural end of the visit, and away from the consulting room.'],
      ['At the pharmacy counter', 'For clinics with an in-house pharmacy, where patients wait for medicines.'],
      ['In the waiting area', 'A QR sign on the reception desk for returning patients who wait for follow-ups.'],
    ],
    mentions: ['Caring doctor', 'Clear explanation', 'Short wait', 'Clean clinic', 'Helpful staff'],
    catchEarly: [
      'Long waiting times beyond the appointment slot',
      'Reports or prescriptions not ready when promised',
      'Billing and insurance questions',
      'Front-desk communication',
    ],
    script: '“If you were happy with your visit today, you can leave the clinic a review on Google by scanning this QR code.”',
    note:
      'Check your professional body’s rules on patient testimonials before asking for reviews. When replying to reviews, never confirm that someone is a patient or mention any medical details.',
    faqs: [
      {
        q: 'Is it appropriate for a clinic to ask for Google reviews?',
        a: 'Many clinics do, but it should be done gently, by front-desk staff, and without any link to treatment. Check the rules of your professional body on testimonials before you start.',
      },
      {
        q: 'Do patients have to share medical details?',
        a: 'No. Patients write whatever they choose. The suggested prompts focus on the visit itself, such as waiting time and staff, not on health conditions.',
      },
      {
        q: 'Who receives private feedback from patients?',
        a: 'It goes to the alert number you set during setup, usually the clinic manager, and is stored in your dashboard. It is not published anywhere.',
      },
    ],
  },
  {
    slug: 'retail',
    label: 'Shops and showrooms',
    metaTitle: 'Google Review QR Codes for Shops and Showrooms',
    metaDescription:
      'Google review QR codes for retail shops, showrooms and boutiques. Customers scan at the billing counter while their purchase is packed and leave a review.',
    h1: 'Google reviews for shops and showrooms',
    lead:
      'Whether you sell sarees, phones or furniture, shoppers check Google before they visit. A review QR code at the billing counter turns a good buying experience into a review while the purchase is being packed.',
    moment:
      'The best time is at the billing counter, while the purchase is being packed or the warranty card is being filled in. For big purchases such as electronics or furniture, the salesperson who helped the customer should make the ask.',
    placement: [
      ['At the billing counter', 'Every customer passes it, and there is usually a short wait.'],
      ['At the trial room exit', 'For clothing stores, where customers have just had help with sizes.'],
      ['At the delivery or pickup desk', 'For showrooms where bigger items are collected later.'],
    ],
    mentions: ['Good range', 'Helpful staff', 'Fair prices', 'Quick billing', 'Easy to find things'],
    catchEarly: [
      'Exchange and return questions',
      'Staff not available on the shop floor',
      'Long billing queues at weekends',
      'Items out of stock or different from what was shown',
    ],
    script: '“Thanks for shopping with us. If you liked the service, scan this to leave a quick Google review.”',
    faqs: [
      {
        q: 'We have several billing counters. Do we need a QR code for each?',
        a: 'It helps. Name each QR code after its counter and the dashboard shows which one gets used most.',
      },
      {
        q: 'We have more than one store. Does each need its own account?',
        a: 'Yes. Each store has its own Google listing, so it needs its own Reviewwo account and Place ID so that reviews go to the right branch.',
      },
      {
        q: 'Can we print the QR code on our bags or bills?',
        a: 'Yes. Download any of your QR codes as PNG or SVG and use them on bills, bags or posters.',
      },
    ],
  },
  {
    slug: 'hotels',
    label: 'Hotels and homestays',
    metaTitle: 'Google Review QR Codes for Hotels and Homestays',
    metaDescription:
      'Google review QR codes for hotels, guest houses and homestays. Guests scan at checkout or in the room, and the duty manager hears about problems early.',
    h1: 'Google reviews for hotels and homestays',
    lead:
      'Travellers compare hotels on Google Maps as well as on booking sites. Reviews on your own Google listing help guests who search directly and book with you.',
    moment:
      'Checkout is the classic moment, but problems are best caught during the stay. A QR code in the room lets guests tell the duty manager about a broken AC or a noisy room on the first night, when it can still be fixed.',
    placement: [
      ['At the reception desk', 'Mention it at checkout while the bill is being prepared.'],
      ['In each room', 'On the desk or bedside table, named after the room number so you know where feedback comes from.'],
      ['In the restaurant or breakfast area', 'For hotels with dining, guests often review breakfast separately.'],
    ],
    mentions: ['Clean room', 'Helpful staff', 'Comfortable stay', 'Good location', 'Good breakfast'],
    catchEarly: [
      'Air conditioning, hot water or Wi-Fi not working',
      'Noise from nearby rooms or the street',
      'Housekeeping missed or late',
      'Check-in delays',
    ],
    script: '“We hope you enjoyed your stay. If you have a minute before you leave, a Google review would mean a lot to us.”',
    faqs: [
      {
        q: 'Can guests send feedback during their stay?',
        a: 'Yes. With a QR code in the room, guests can message the duty manager privately at any time. The message is forwarded to WhatsApp so it can be fixed the same day.',
      },
      {
        q: 'Does this replace reviews on booking sites?',
        a: 'No. It is for your Google listing, which travellers also check. Guests can still review you on the site they booked through.',
      },
      {
        q: 'How many QR codes does a small homestay need?',
        a: 'Starter includes one QR code, which is enough at reception. Growth covers up to five, for example one per room.',
      },
    ],
  },
  {
    slug: 'gyms',
    label: 'Gyms and studios',
    metaTitle: 'Google Review QR Codes for Gyms and Studios',
    metaDescription:
      'Google review QR codes for gyms, yoga studios and fitness centres. Members scan at the front desk, and the manager hears about equipment issues early.',
    h1: 'Google reviews for gyms and studios',
    lead:
      'People searching for a gym near them compare ratings, photos and comments about trainers and cleanliness. Members who love your classes are your best advertisement, if you make it easy for them.',
    moment:
      'Ask after a good class or a personal-training session, when members feel the effort was worth it. New members around their second or third week are often keen to share their experience.',
    placement: [
      ['At the front desk', 'Members pass it on the way in and out.'],
      ['In the studio', 'Instructors can mention it at the end of a class.'],
      ['Near the water station', 'Where members pause between sets.'],
    ],
    mentions: ['Good equipment', 'Helpful trainers', 'Clean space', 'Not crowded', 'Good value'],
    catchEarly: [
      'Broken or unavailable equipment',
      'Changing room and shower cleanliness',
      'Peak-hour crowding',
      'Class timings changed without notice',
    ],
    script: '“Great session today. If you enjoy training here, scan this QR code and leave us a Google review.”',
    faqs: [
      {
        q: 'Members visit every day. Will they keep getting asked?',
        a: 'The QR code is passive, so members choose when to use it. Ask each member once, ideally after a few weeks, rather than every visit.',
      },
      {
        q: 'Can members report broken equipment through the QR code?',
        a: 'Yes. Members can send a private message to the manager, which is forwarded to WhatsApp, so equipment problems get fixed quickly.',
      },
      {
        q: 'We run several studios in one building. Can we track each?',
        a: 'Yes, if they share one Google listing. Name each QR code after the studio and compare scans in the dashboard.',
      },
    ],
  },
];

export const industryBySlug = (slug) => INDUSTRIES.find((i) => i.slug === slug);

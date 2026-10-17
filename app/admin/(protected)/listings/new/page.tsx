import { requireAdmin } from '@/lib/admin-access';
import { ListingEditor } from '@/components/listing-editor';
export default async function NewListing(){await requireAdmin();return <><div className="admin-heading"><div><span className="eyebrow">THE COLLECTION</span><h1>A new possibility.</h1><p>Save a draft, then publish when the details are ready.</p></div></div><ListingEditor/></>;}